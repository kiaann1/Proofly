/**
 * Export utilities for CV data to various formats
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from '../types';

/**
 * Export CV as PDF using the preview element
 */
export async function exportToPDF(cvData: CVData, previewElementId: string = 'cv-preview'): Promise<void> {
  try {
    console.log('exportToPDF called with:', { cvData: !!cvData, previewElementId });
    
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.error('Not in browser environment');
      throw new Error('PDF export is only available in browser environment');
    }

    let element = document.getElementById(previewElementId);
    let isTemporaryElement = false;
    
    // If element doesn't exist, create a temporary one
    if (!element) {
      console.log(`Element with ID '${previewElementId}' not found, creating temporary element...`);
      
      // Import the CV renderer
      const { renderCVHTML } = await import('./cvRenderer');
      
      // Create temporary container
      const tempContainer = document.createElement('div');
      const uniqueId = `temp-cv-preview-${Date.now()}`;
      tempContainer.id = uniqueId;
      tempContainer.className = 'temp-cv-preview-container';
      tempContainer.style.cssText = `
        position: absolute !important;
        left: -9999px !important;
        top: 0 !important;
        width: 210mm !important;
        min-height: 297mm !important;
        background-color: #ffffff !important;
        z-index: -1000 !important;
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
        padding: 32px !important;
        box-sizing: border-box !important;
        font-family: Arial, sans-serif !important;
        color: #1f2937 !important;
        line-height: 1.5 !important;
      `;
      
      // Add the HTML content
      tempContainer.innerHTML = renderCVHTML(cvData);
      document.body.appendChild(tempContainer);
      
      // Wait for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      element = tempContainer;
      isTemporaryElement = true;
      
      console.log('Temporary preview element created with ID:', uniqueId);
    }

    // Use the element for PDF generation
    return await generatePDFFromElement(element, cvData, isTemporaryElement);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function generatePDFFromElement(element: HTMLElement, cvData: CVData, isTemporaryElement: boolean): Promise<void> {
  try {
    console.log('Starting PDF generation...', { 
      element, 
      scrollHeight: element.scrollHeight, 
      scrollWidth: element.scrollWidth,
      offsetHeight: element.offsetHeight,
      offsetWidth: element.offsetWidth,
      clientHeight: element.clientHeight,
      clientWidth: element.clientWidth,
      isTemporaryElement
    });

    // Wait for any pending renders
    await new Promise(resolve => setTimeout(resolve, 300));

    // Force a reflow to ensure dimensions are calculated
    element.style.visibility = 'visible';
    element.style.display = 'block';
    element.offsetHeight; // Force reflow

    // Wait a bit more for layout to settle
    await new Promise(resolve => setTimeout(resolve, 200));

    // Validate element dimensions
    const elementRect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    console.log('Element dimensions:', {
      rect: elementRect,
      scrollHeight: element.scrollHeight,
      scrollWidth: element.scrollWidth,
      computedWidth: computedStyle.width,
      computedHeight: computedStyle.height
    });

    if (element.scrollHeight === 0 || element.scrollWidth === 0) {
      console.error('Element has zero dimensions', { 
        scrollHeight: element.scrollHeight, 
        scrollWidth: element.scrollWidth,
        offsetHeight: element.offsetHeight,
        offsetWidth: element.offsetWidth,
        clientHeight: element.clientHeight,
        clientWidth: element.clientWidth,
        computedStyle: {
          width: computedStyle.width,
          height: computedStyle.height,
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          position: computedStyle.position
        }
      });
      throw new Error('CV preview element has no content or zero dimensions. Make sure the CV form is filled out.');
    }

    // Create canvas from the CV preview element
    console.log('About to create canvas with html2canvas...');
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth,
      logging: false,
      removeContainer: false,
      imageTimeout: 15000,
      foreignObjectRendering: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(element.scrollWidth, 794), // A4 width in pixels at 96 DPI
      windowHeight: element.scrollHeight,
      x: 0,
      y: 0,
      ignoreElements: (element) => {
        // Skip problematic elements
        const tagName = element.tagName?.toLowerCase();
        if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
          return true;
        }
        const styles = window.getComputedStyle(element);
        if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
          return true;
        }
        return false;
      }
    });

    console.log('Canvas created successfully', { width: canvas.width, height: canvas.height });

    // Create PDF with high quality settings
    const imgData = canvas.toDataURL('image/png', 1.0);
    console.log('Image data created, length:', imgData.length);
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false,
      precision: 2
    });

    console.log('PDF instance created');

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    console.log('Adding image to PDF...', { 
      imgWidth, 
      imgHeight, 
      pageHeight, 
      canvasHeight: canvas.height, 
      canvasWidth: canvas.width 
    });

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;
    }

    // Download the PDF
    const fileName = `${cvData.personalInfo.name || 'CV'}_Resume.pdf`;
    console.log('Saving PDF with filename:', fileName);
    pdf.save(fileName);
    console.log('PDF export completed successfully');
  } finally {
    // Clean up temporary element if created
    if (isTemporaryElement && element.parentNode) {
      element.parentNode.removeChild(element);
      console.log('Temporary element cleaned up');
    }
  }
}

/**
 * Export CV as DOCX document
 */
export async function exportToDOCX(cvData: CVData): Promise<void> {
  try {
    const children: any[] = [];
    const template = cvData.template || { id: 'modern', name: 'Modern', description: 'Modern style', category: 'modern' };

    // Get template-based styling preferences
    const getTemplateStyles = (templateId: string) => {
      switch (templateId) {
        case 'minimal':
          return {
            nameSize: 28,
            sectionSize: 16,
            nameAlignment: 'left',
            useColors: false,
          };
        case 'classic':
          return {
            nameSize: 32,
            sectionSize: 18,
            nameAlignment: 'center',
            useColors: false,
          };
        case 'modern':
        case 'two-column':
          return {
            nameSize: 30,
            sectionSize: 16,
            nameAlignment: 'left',
            useColors: true,
          };
        case 'creative':
          return {
            nameSize: 32,
            sectionSize: 18,
            nameAlignment: 'left',
            useColors: true,
          };
        default:
          return {
            nameSize: 28,
            sectionSize: 16,
            nameAlignment: 'left',
            useColors: false,
          };
      }
    };

    const styles = getTemplateStyles(template.id);

    // Personal Information
    if (cvData.personalInfo.name) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.personalInfo.name,
              bold: true,
              size: styles.nameSize * 2, // Size is in half-points
              color: styles.useColors ? '2563EB' : '000000', // Blue for modern templates
            })
          ],
          alignment: styles.nameAlignment as any,
          spacing: { after: 200 },
        })
      );
    }

    // Contact information
    const contactInfo: string[] = [];
    if (cvData.personalInfo.email) contactInfo.push(`📧 ${cvData.personalInfo.email}`);
    if (cvData.personalInfo.phone) contactInfo.push(`📞 ${cvData.personalInfo.phone}`);
    if (cvData.personalInfo.location) contactInfo.push(`📍 ${cvData.personalInfo.location}`);

    if (contactInfo.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactInfo.join(' | '),
              size: 20,
            })
          ],
          alignment: styles.nameAlignment as any,
          spacing: { after: 150 },
        })
      );
    }

    // Links with icons
    const links: string[] = [];
    if (cvData.personalInfo.linkedin) links.push(`💼 LinkedIn: ${cvData.personalInfo.linkedin}`);
    if (cvData.personalInfo.github) links.push(`🐙 GitHub: ${cvData.personalInfo.github}`);
    if (cvData.personalInfo.website) links.push(`🌐 Website: ${cvData.personalInfo.website}`);
    if (cvData.personalInfo.portfolio) links.push(`🎨 Portfolio: ${cvData.personalInfo.portfolio}`);

    if (links.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: links.join(' | '),
              size: 18,
              color: styles.useColors ? '2563EB' : '666666',
            })
          ],
          alignment: styles.nameAlignment as any,
          spacing: { after: 300 },
        })
      );
    }

    // Professional Summary
    if (cvData.personalInfo.summary) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'PROFESSIONAL SUMMARY',
              bold: true,
              size: styles.sectionSize * 2,
              color: styles.useColors ? '2563EB' : '000000',
            })
          ],
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.personalInfo.summary,
              size: 22,
            })
          ],
          spacing: { after: 250 },
        })
      );
    }

    // Work Experience
    if (cvData.experience.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'WORK EXPERIENCE',
              bold: true,
              size: styles.sectionSize * 2,
              color: styles.useColors ? '2563EB' : '000000',
            })
          ],
          spacing: { before: 200, after: 150 },
        })
      );

      cvData.experience.forEach((exp, index) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position,
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: ` | ${exp.company}`,
                size: 24,
                color: styles.useColors ? '2563EB' : '333333',
              }),
            ],
            spacing: { before: index > 0 ? 200 : 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                italics: true,
                size: 20,
                color: '666666',
              }),
              ...(exp.location ? [new TextRun({
                text: ` | ${exp.location}`,
                italics: true,
                size: 20,
                color: '666666',
              })] : [])
            ],
            spacing: { after: 100 },
          })
        );

        if (exp.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.description,
                  size: 22,
                })
              ],
              spacing: { after: 100 },
            })
          );
        }

        // Achievements with bullet points
        exp.achievements.forEach((achievement) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${achievement}`,
                  size: 22,
                })
              ],
              indent: { left: 720 }, // Left indent for bullet points
            })
          );
        });

        if (index < cvData.experience.length - 1) {
          children.push(new Paragraph({ text: '', spacing: { after: 150 } }));
        }
      });
    }

    // Education
    if (cvData.education.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'EDUCATION',
              bold: true,
              size: styles.sectionSize * 2,
              color: styles.useColors ? '2563EB' : '000000',
            })
          ],
          spacing: { before: 300, after: 150 },
        })
      );

      cvData.education.forEach((edu, index) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: index > 0 ? 200 : 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: edu.institution,
                size: 22,
                color: styles.useColors ? '2563EB' : '333333',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
                italics: true,
                size: 20,
                color: '666666',
              }),
              ...(edu.location ? [new TextRun({
                text: ` | ${edu.location}`,
                italics: true,
                size: 20,
                color: '666666',
              })] : [])
            ],
            spacing: { after: 100 },
          })
        );

        if (edu.gpa) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Grade: ${edu.gpa}`,
                  italics: true,
                  size: 20,
                  color: '666666',
                })
              ],
              spacing: { after: 100 },
            })
          );
        }

        if (edu.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.description,
                  size: 22,
                })
              ],
              spacing: { after: 100 },
            })
          );
        }
      });
    }

    // Skills
    if (cvData.skills.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'SKILLS',
              bold: true,
              size: styles.sectionSize * 2,
              color: styles.useColors ? '2563EB' : '000000',
            })
          ],
          spacing: { before: 300, after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.skills.join(' • '),
              size: 22,
            })
          ],
          spacing: { after: 200 },
        })
      );
    }

    // Certifications
    if (cvData.certifications.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'CERTIFICATIONS',
              bold: true,
              size: styles.sectionSize * 2,
              color: styles.useColors ? '2563EB' : '000000',
            })
          ],
          spacing: { before: 300, after: 150 },
        })
      );

      cvData.certifications.forEach((cert, index) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name,
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: ` | ${cert.issuer}`,
                size: 22,
                color: styles.useColors ? '2563EB' : '333333',
              }),
            ],
            spacing: { before: index > 0 ? 150 : 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: cert.date,
                italics: true,
                size: 20,
                color: '666666',
              }),
              ...(cert.expiryDate ? [new TextRun({
                text: ` | Expires: ${cert.expiryDate}`,
                italics: true,
                size: 20,
                color: '666666',
              })] : [])
            ],
            spacing: { after: 100 },
          })
        );
      });
    }

    // Languages
    if (cvData.languages.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'LANGUAGES',
              bold: true,
              size: styles.sectionSize * 2,
              color: styles.useColors ? '2563EB' : '000000',
            })
          ],
          spacing: { before: 300, after: 150 },
        })
      );

      cvData.languages.forEach((lang, index) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${lang.name}: `,
                bold: true,
                size: 22,
              }),
              new TextRun({
                text: lang.proficiency,
                size: 22,
                color: styles.useColors ? '2563EB' : '333333',
              })
            ],
            spacing: { before: index > 0 ? 100 : 0 },
          })
        );
      });
    }

    // Salary Expectation (if enabled)
    if (cvData.personalInfo.showSalaryInCV && cvData.personalInfo.salaryExpectation) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'SALARY EXPECTATION',
              bold: true,
              size: styles.sectionSize * 2,
              color: styles.useColors ? '2563EB' : '000000',
            })
          ],
          spacing: { before: 300, after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.personalInfo.salaryExpectation,
              size: 22,
            })
          ],
          spacing: { after: 200 },
        })
      );
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const fileName = `${cvData.personalInfo.name || 'CV'}_Resume.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw new Error('Failed to export DOCX. Please try again.');
  }
}

/**
 * Export CV as Markdown text
 */
export function exportToMarkdown(cvData: CVData): void {
  try {
    let markdown = '';

    // Personal Information
    if (cvData.personalInfo.name) {
      markdown += `# ${cvData.personalInfo.name}\n\n`;
    }

    // Contact information
    const contactInfo: string[] = [];
    if (cvData.personalInfo.email) contactInfo.push(`📧 ${cvData.personalInfo.email}`);
    if (cvData.personalInfo.phone) contactInfo.push(`📞 ${cvData.personalInfo.phone}`);
    if (cvData.personalInfo.location) contactInfo.push(`📍 ${cvData.personalInfo.location}`);

    if (contactInfo.length > 0) {
      markdown += `${contactInfo.join(' | ')}\n\n`;
    }

    // Links
    const links: string[] = [];
    if (cvData.personalInfo.linkedin) links.push(`[LinkedIn](${cvData.personalInfo.linkedin})`);
    if (cvData.personalInfo.github) links.push(`[GitHub](${cvData.personalInfo.github})`);
    if (cvData.personalInfo.website) links.push(`[Website](${cvData.personalInfo.website})`);

    if (links.length > 0) {
      markdown += `${links.join(' | ')}\n\n`;
    }

    // Professional Summary
    if (cvData.personalInfo.summary) {
      markdown += `## Professional Summary\n\n${cvData.personalInfo.summary}\n\n`;
    }

    // Work Experience
    if (cvData.experience.length > 0) {
      markdown += `## Work Experience\n\n`;

      cvData.experience.forEach((exp) => {
        markdown += `### ${exp.position} at ${exp.company}\n`;
        markdown += `*${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}*\n`;
        
        if (exp.location) {
          markdown += `*${exp.location}*\n`;
        }
        
        markdown += `\n`;

        if (exp.description) {
          markdown += `${exp.description}\n\n`;
        }

        if (exp.achievements.length > 0) {
          exp.achievements.forEach((achievement) => {
            markdown += `- ${achievement}\n`;
          });
          markdown += `\n`;
        }
      });
    }

    // Education
    if (cvData.education.length > 0) {
      markdown += `## Education\n\n`;

      cvData.education.forEach((edu) => {
        markdown += `### ${edu.degree}\n`;
        markdown += `**${edu.institution}**\n`;
        markdown += `*${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}*\n`;
        
        if (edu.gpa) {
          markdown += `*GPA: ${edu.gpa}*\n`;
        }
        
        markdown += `\n`;

        if (edu.description) {
          markdown += `${edu.description}\n\n`;
        }
      });
    }

    // Skills
    if (cvData.skills.length > 0) {
      markdown += `## Skills\n\n`;
      markdown += `${cvData.skills.join(', ')}\n\n`;
    }

    // Certifications
    if (cvData.certifications.length > 0) {
      markdown += `## Certifications\n\n`;

      cvData.certifications.forEach((cert) => {
        markdown += `- **${cert.name}** - ${cert.issuer} (${cert.date})`;
        if (cert.expiryDate) {
          markdown += ` *Expires: ${cert.expiryDate}*`;
        }
        markdown += `\n`;
      });
      markdown += `\n`;
    }

    // Languages
    if (cvData.languages.length > 0) {
      markdown += `## Languages\n\n`;

      cvData.languages.forEach((lang) => {
        markdown += `- ${lang.name}: ${lang.proficiency}\n`;
      });
    }

    // Create and download the file
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const fileName = `${cvData.personalInfo.name || 'CV'}_Resume.md`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error exporting to Markdown:', error);
    throw new Error('Failed to export Markdown. Please try again.');
  }
}

/**
 * Export cover letter as PDF with proper page breaks and formatting
 */
export async function exportCoverLetterToPDF(letterContent: string, fileName: string = 'cover_letter.pdf'): Promise<void> {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }

    console.log('Starting cover letter PDF export...');

    // Create PDF with proper formatting and page breaks
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 25; // 25mm margins for formal letter
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);
    
    // Set up fonts and styling
    pdf.setFont('times', 'normal');
    pdf.setFontSize(11);
    
    let currentY = margin;
    const lineHeight = 6; // Spacing between lines
    const paragraphSpacing = 8; // Extra spacing between paragraphs
    
    // Split content into paragraphs
    const paragraphs = letterContent.split('\n\n').filter(p => p.trim());
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      
      // Handle different types of content
      if (paragraph.includes('@') && paragraph.includes('.')) {
        // Email address - smaller font
        pdf.setFontSize(10);
        const emailLines = pdf.splitTextToSize(paragraph, maxWidth);
        
        for (const line of emailLines) {
          if (currentY + lineHeight > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(line, margin, currentY);
          currentY += lineHeight;
        }
        currentY += paragraphSpacing;
        pdf.setFontSize(11); // Reset font size
        
      } else if (paragraph.toLowerCase().includes('dear ') || paragraph.toLowerCase().includes('sincerely') || paragraph.toLowerCase().includes('best regards') || paragraph.toLowerCase().includes('yours faithfully')) {
        // Salutation or closing - normal formatting
        const lines = pdf.splitTextToSize(paragraph, maxWidth);
        
        for (const line of lines) {
          if (currentY + lineHeight > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(line, margin, currentY);
          currentY += lineHeight;
        }
        currentY += paragraphSpacing;
        
      } else if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
        // Bullet points - handle with proper indentation
        const bulletLines = paragraph.split('\n').filter(line => line.trim());
        
        for (const bulletLine of bulletLines) {
          const cleanLine = bulletLine.replace(/^[•\-*]\s*/, '• '); // Normalize bullet
          const lines = pdf.splitTextToSize(cleanLine, maxWidth - 10); // Indent bullets
          
          for (let j = 0; j < lines.length; j++) {
            if (currentY + lineHeight > pageHeight - margin) {
              pdf.addPage();
              currentY = margin;
            }
            
            const indentX = j === 0 ? margin + 5 : margin + 8; // First line less indented
            pdf.text(lines[j], indentX, currentY);
            currentY += lineHeight;
          }
        }
        currentY += paragraphSpacing;
        
      } else {
        // Regular paragraph
        const lines = pdf.splitTextToSize(paragraph, maxWidth);
        
        for (const line of lines) {
          if (currentY + lineHeight > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(line, margin, currentY);
          currentY += lineHeight;
        }
        currentY += paragraphSpacing;
      }
    }

    // Download the PDF
    pdf.save(fileName);
    console.log('Cover letter PDF export completed successfully');
    
  } catch (error) {
    console.error('Error exporting cover letter to PDF:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('window')) {
        throw new Error('PDF export is not available in this environment. Please try refreshing the page.');
      } else {
        throw new Error(`PDF export failed: ${error.message}`);
      }
    }
    
    throw new Error('Failed to export PDF. Please try again.');
  }
}

/**
 * Fallback text-based PDF generation
 */
function generateTextBasedPDF(letterContent: string, fileName: string): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const lineHeight = 5;
  const fontSize = 11;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(fontSize);
  
  const lines = pdf.splitTextToSize(letterContent, pageWidth - (margin * 2));
  let y = margin;
  
  lines.forEach((line: string) => {
    if (y + lineHeight > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, margin, y);
    y += lineHeight;
  });
  
  pdf.save(fileName);
}

/**
 * Export cover letter as DOCX document
 */
export async function exportCoverLetterToDOCX(
  letterContent: string, 
  fileName: string = 'cover_letter.docx'
): Promise<void> {
  try {
    const children: any[] = [];

    // Split the letter content into paragraphs and handle spacing properly
    const paragraphs = letterContent.split('\n\n').filter(p => p.trim());

    paragraphs.forEach((paragraph, index) => {
      // Handle line breaks within paragraphs
      const lines = paragraph.split('\n').filter(line => line.trim());
      
      if (lines.length === 1) {
        // Single line paragraph
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: lines[0].trim(),
                size: 24, // 12pt font
                font: 'Times New Roman',
              }),
            ],
            spacing: {
              after: index === paragraphs.length - 1 ? 0 : 240, // Space after paragraph except last
              line: 360, // 1.5 line spacing
            },
          })
        );
      } else {
        // Multi-line paragraph (like addresses or lists)
        lines.forEach((line, lineIndex) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.trim(),
                  size: 24, // 12pt font
                  font: 'Times New Roman',
                }),
              ],
              spacing: {
                after: lineIndex === lines.length - 1 && index === paragraphs.length - 1 ? 0 : 120, // Smaller spacing for lines within paragraph
                line: 360, // 1.5 line spacing
              },
            })
          );
        });
      }
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch in twips
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error exporting cover letter to DOCX:', error);
    throw new Error('Failed to export DOCX. Please try again.');
  }
}

/**
 * Enhanced PDF export with proper page breaks
 * Uses a more sophisticated approach to handle content across multiple pages
 */
export async function exportToPDFWithPageBreaks(cvData: CVData): Promise<void> {
  try {
    console.log('Enhanced PDF export with page breaks started');
    
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }

    // Create PDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false,
      precision: 2
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 20; // Margins in mm
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);
    
    let currentY = margin;
    let isFirstPage = true;

    // Set up fonts and styles
    pdf.setFont('helvetica');
    
    // Helper function to check page break and handle content continuation
    const checkPageBreak = (requiredHeight: number, forceBreak: boolean = false): boolean => {
      if (forceBreak || (currentY + requiredHeight > pageHeight - margin - 10)) { // Extra margin buffer
        pdf.addPage();
        currentY = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrapping and improved spacing
    const addText = (text: string, x: number, y: number, options: {
      fontSize?: number;
      fontStyle?: 'normal' | 'bold' | 'italic';
      color?: string;
      maxWidth?: number;
      lineHeight?: number;
      align?: 'left' | 'center' | 'right';
    } = {}): number => {
      const {
        fontSize = 10,
        fontStyle = 'normal',
        color = '#000000',
        maxWidth = contentWidth,
        lineHeight = fontSize * 0.4,
        align = 'left'
      } = options;

      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      
      // Convert hex color to RGB
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        pdf.setTextColor(r, g, b);
      }

      // Handle empty text
      if (!text || text.trim() === '') {
        return y;
      }

      // Split text into lines that fit within maxWidth
      const lines = pdf.splitTextToSize(text.trim(), maxWidth);
      
      for (let i = 0; i < lines.length; i++) {
        // Check if we need a page break for each line
        if (checkPageBreak(lineHeight + 2)) {
          y = currentY;
        }
        
        let textX = x;
        if (align === 'center') {
          textX = x + (maxWidth / 2);
        } else if (align === 'right') {
          textX = x + maxWidth;
        }
        
        pdf.text(lines[i], textX, y + (i * lineHeight), { align: align });
      }
      
      return y + (lines.length * lineHeight);
    };

    // Helper function to add section with proper spacing
    const addSection = (title: string, content: () => number): void => {
      // Add some space before section (except for first section)
      if (currentY > margin + 10) {
        currentY += 8;
      }
      
      // Check if we need page break for section title
      checkPageBreak(15);
      
      // Add section title
      currentY = addText(title, margin, currentY, {
        fontSize: 14,
        fontStyle: 'bold',
        color: '#1f2937'
      });
      
      // Add underline
      pdf.setDrawColor(229, 231, 235); // Light gray
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY + 2, margin + contentWidth, currentY + 2);
      
      currentY += 6;
      
      // Add section content
      currentY = content();
    };

    // Personal Information Header
    const addPersonalInfo = (): number => {
      let y = currentY;
      
      // Name
      if (cvData.personalInfo.name) {
        y = addText(cvData.personalInfo.name, margin, y, {
          fontSize: 20,
          fontStyle: 'bold',
          color: '#1f2937'
        });
        y += 4;
      }
      
      // Contact information in a single line if possible
      const contactInfo: string[] = [];
      if (cvData.personalInfo.email) contactInfo.push(cvData.personalInfo.email);
      if (cvData.personalInfo.phone) contactInfo.push(cvData.personalInfo.phone);
      if (cvData.personalInfo.location) contactInfo.push(cvData.personalInfo.location);
      
      if (contactInfo.length > 0) {
        y = addText(contactInfo.join(' • '), margin, y, {
          fontSize: 10,
          color: '#6b7280'
        });
        y += 2;
      }
      
      // Links
      const links: string[] = [];
      if (cvData.personalInfo.website) {
        links.push(`🌐 ${cvData.personalInfo.website.replace(/^https?:\/\//, '')}`);
      }
      if (cvData.personalInfo.linkedin) {
        links.push(`💼 ${cvData.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`);
      }
      if (cvData.personalInfo.github) {
        links.push(`🐙 ${cvData.personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}`);
      }
      
      if (links.length > 0) {
        y = addText(links.join(' • '), margin, y, {
          fontSize: 9,
          color: '#6b7280'
        });
        y += 6;
      }
      
      return y;
    };

    // Professional Summary
    const addSummary = (): number => {
      let y = currentY;
      if (cvData.personalInfo.summary) {
        y = addText(cvData.personalInfo.summary, margin, y, {
          fontSize: 10,
          lineHeight: 4.5
        });
        y += 4;
      }
      return y;
    };

    // Work Experience
    const addExperience = (): number => {
      let y = currentY;
      
      cvData.experience.forEach((exp, index) => {
        // Calculate estimated height for this experience entry
        const estimatedHeight = 35 + (exp.achievements ? exp.achievements.length * 4 : 0);
        
        // Check if we need a page break for this experience entry
        if (checkPageBreak(estimatedHeight)) {
          y = currentY;
        }
        
        // Position and Company
        const positionText = `${exp.position}`;
        y = addText(positionText, margin, y, {
          fontSize: 12,
          fontStyle: 'bold',
          color: '#1f2937'
        });
        
        // Company name
        y = addText(exp.company, margin, y, {
          fontSize: 11,
          color: '#3b82f6' // Blue color for company
        });
        
        // Dates and Location
        const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
        const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '');
        const dateRange = `${startDate} - ${endDate}`;
        const locationAndDate = exp.location ? `${exp.location} • ${dateRange}` : dateRange;
        
        y = addText(locationAndDate, margin, y, {
          fontSize: 9,
          color: '#6b7280',
          fontStyle: 'italic'
        });
        y += 3;
        
        // Description
        if (exp.description && exp.description.trim()) {
          y = addText(exp.description, margin, y, {
            fontSize: 10,
            lineHeight: 4.5
          });
          y += 3;
        }
        
        // Achievements with better formatting
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach(achievement => {
            if (achievement.trim()) {
              // Check for page break before each achievement
              if (checkPageBreak(8)) {
                y = currentY;
              }
              
              y = addText(`• ${achievement.trim()}`, margin + 4, y, {
                fontSize: 10,
                lineHeight: 4.5,
                color: '#374151'
              });
              y += 2;
            }
          });
        }
        
        // Add space between experiences (but not after the last one)
        if (index < cvData.experience.length - 1) {
          y += 6;
        }
        
        currentY = y;
      });
      
      return y;
    };

    // Skills
    const addSkills = (): number => {
      let y = currentY;
      
      if (cvData.skills && cvData.skills.length > 0) {
        // Group skills into lines that fit the page width
        const skillsText = cvData.skills.join(' • ');
        y = addText(skillsText, margin, y, {
          fontSize: 10,
          lineHeight: 4.5
        });
        y += 4;
      }
      
      return y;
    };

    // Education
    const addEducation = (): number => {
      let y = currentY;
      
      cvData.education.forEach((edu, index) => {
        // Check for page break
        const estimatedHeight = 20;
        checkPageBreak(estimatedHeight);
        y = currentY;
        
        // Degree and Institution
        const educationTitle = `${edu.degree} - ${edu.institution}`;
        y = addText(educationTitle, margin, y, {
          fontSize: 11,
          fontStyle: 'bold',
          color: '#1f2937'
        });
        
        // Dates and Grade
        const startDate = edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
        const endDate = edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '');
        const dateRange = `${startDate} - ${endDate}`;
        const gradeInfo = edu.gpa ? ` • Grade: ${edu.gpa}` : '';
        const locationAndDate = `${edu.location || ''} • ${dateRange}${gradeInfo}`;
        
        y = addText(locationAndDate, margin, y, {
          fontSize: 9,
          color: '#6b7280'
        });
        
        // Description
        if (edu.description) {
          y += 2;
          y = addText(edu.description, margin, y, {
            fontSize: 10,
            lineHeight: 4
          });
        }
        
        // Add space between entries
        if (index < cvData.education.length - 1) {
          y += 4;
        }
        
        currentY = y;
      });
      
      return y;
    };

    // Certifications
    const addCertifications = (): number => {
      let y = currentY;
      
      cvData.certifications.forEach((cert, index) => {
        const certText = `${cert.name} - ${cert.issuer}`;
        const dateText = cert.date ? ` (${new Date(cert.date).getFullYear()})` : '';
        
        y = addText(`• ${certText}${dateText}`, margin, y, {
          fontSize: 10,
          lineHeight: 4
        });
        
        currentY = y;
      });
      
      return y;
    };

    // Languages
    const addLanguages = (): number => {
      let y = currentY;
      
      if (cvData.languages && cvData.languages.length > 0) {
        const languagesList = cvData.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ');
        y = addText(languagesList, margin, y, {
          fontSize: 10,
          lineHeight: 4.5
        });
      }
      
      return y;
    };

    // Build the PDF content
    currentY = addPersonalInfo();
    currentY += 6;

    // Add sections in order
    if (cvData.personalInfo.summary) {
      addSection('Professional Summary', addSummary);
    }
    
    if (cvData.experience && cvData.experience.length > 0) {
      addSection('Professional Experience', addExperience);
    }
    
    if (cvData.skills && cvData.skills.length > 0) {
      addSection('Skills', addSkills);
    }
    
    if (cvData.education && cvData.education.length > 0) {
      addSection('Education', addEducation);
    }
    
    if (cvData.certifications && cvData.certifications.length > 0) {
      addSection('Certifications', addCertifications);
    }
    
    if (cvData.languages && cvData.languages.length > 0) {
      addSection('Languages', addLanguages);
    }

    // Save the PDF
    const fileName = `${cvData.personalInfo.name || 'CV'}_Resume.pdf`;
    pdf.save(fileName);
    
    console.log('Enhanced PDF export with page breaks completed successfully');
  } catch (error) {
    console.error('Error in enhanced PDF export:', error);
    throw new Error(`Failed to export PDF with page breaks: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
