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

    const element = document.getElementById(previewElementId);
    if (!element) {
      console.error(`Element with ID '${previewElementId}' not found`);
      throw new Error(`Preview element with ID '${previewElementId}' not found`);
    }

    console.log('Starting PDF export...', { element, scrollHeight: element.scrollHeight, scrollWidth: element.scrollWidth });    // Wait a bit for any pending renders
    await new Promise(resolve => setTimeout(resolve, 100));

    // Validate element dimensions
    if (element.scrollHeight === 0 || element.scrollWidth === 0) {
      console.error('Element has zero dimensions', { 
        scrollHeight: element.scrollHeight, 
        scrollWidth: element.scrollWidth,
        offsetHeight: element.offsetHeight,
        offsetWidth: element.offsetWidth
      });
      throw new Error('CV preview element has no content or zero dimensions');
    }    // Create canvas from the CV preview element
    console.log('About to create canvas with html2canvas...');
    const canvas = await html2canvas(element, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth,
      logging: false,
      removeContainer: true,
      imageTimeout: 20000, // Increased timeout
      foreignObjectRendering: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      x: 0,
      y: 0,
      ignoreElements: (element) => {
        // Skip elements that might cause issues
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE' || element.tagName === 'NOSCRIPT') {
          return true;
        }
        // Skip hidden elements
        const styles = window.getComputedStyle(element);
        if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
          return true;
        }
        return false;
      },
      onclone: (clonedDoc) => {
        // Remove any problematic elements in cloned document
        const clonedElement = clonedDoc.getElementById(previewElementId);
        if (clonedElement) {
          // Remove any elements that might cause issues
          const problematicElements = clonedElement.querySelectorAll('iframe, embed, object, video, script, noscript');
          problematicElements.forEach(el => el.remove());
            // Force all colors to be RGB and handle CSS variables
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const htmlEl = el as HTMLElement;
            
            // Helper function to convert any color to a safe RGB value
            const getSafeColor = (colorValue: string, defaultColor: string): string => {
              if (!colorValue || colorValue === 'transparent' || colorValue === 'inherit' || colorValue === 'initial') {
                return defaultColor;
              }
              
              // Convert CSS variables, oklch, lab, lch, and other modern color formats to RGB
              if (colorValue.includes('var(') || colorValue.includes('oklch') || 
                  colorValue.includes('lab(') || colorValue.includes('lch(') ||
                  colorValue.includes('color-mix(') || colorValue.includes('light-dark(')) {
                return defaultColor;
              }
              
              // If it's already RGB/RGBA or hex, keep it
              if (colorValue.match(/^(rgb|rgba|#)/)) {
                return colorValue;
              }
              
              // For named colors and other formats, use default
              return defaultColor;
            };
              // Preserve all computed styles as inline styles for better PDF rendering
            const computedStyles = {
              color: getSafeColor(styles.color, '#374151'),
              backgroundColor: getSafeColor(styles.backgroundColor, 'transparent'),
              borderColor: getSafeColor(styles.borderColor, '#d1d5db'),
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              fontFamily: styles.fontFamily || 'Arial, "Helvetica Neue", Helvetica, sans-serif',
              lineHeight: styles.lineHeight,
              textAlign: styles.textAlign as any,
              marginTop: styles.marginTop,
              marginBottom: styles.marginBottom,
              marginLeft: styles.marginLeft,
              marginRight: styles.marginRight,
              paddingTop: styles.paddingTop,
              paddingBottom: styles.paddingBottom,
              paddingLeft: styles.paddingLeft,
              paddingRight: styles.paddingRight,
              borderWidth: styles.borderWidth,
              borderStyle: styles.borderStyle,
              borderRadius: styles.borderRadius,
              display: styles.display,
              flexDirection: styles.flexDirection as any,
              flexWrap: styles.flexWrap as any,
              justifyContent: styles.justifyContent as any,
              alignItems: styles.alignItems as any,
              gap: styles.gap,
              // Additional layout properties for better PDF rendering
              width: styles.width,
              height: styles.height,
              minWidth: styles.minWidth,
              minHeight: styles.minHeight,
              maxWidth: styles.maxWidth,
              maxHeight: styles.maxHeight,
              position: styles.position,
              top: styles.top,
              left: styles.left,
              right: styles.right,
              bottom: styles.bottom,
              transform: styles.transform,
              opacity: styles.opacity,
              textDecoration: styles.textDecoration,
              textTransform: styles.textTransform,
              letterSpacing: styles.letterSpacing,
              wordSpacing: styles.wordSpacing
            };

            // Apply all preserved styles
            Object.entries(computedStyles).forEach(([property, value]) => {
              if (value && value !== 'transparent' && value !== 'none' && value !== 'normal' && value !== 'auto') {
                (htmlEl.style as any)[property] = value;
              }
            });
            
            // Force safe web fonts and ensure text is readable
            htmlEl.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
            
            // Ensure specific styles for better PDF rendering
            if (htmlEl.tagName === 'H1' || htmlEl.tagName === 'H2' || htmlEl.tagName === 'H3') {
              htmlEl.style.pageBreakInside = 'avoid';
              htmlEl.style.pageBreakAfter = 'avoid';
            }
            
            // Prevent breaking of experience items
            if (htmlEl.className.includes('experience') || htmlEl.className.includes('section')) {
              htmlEl.style.pageBreakInside = 'avoid';
              htmlEl.style.breakInside = 'avoid';
            }
            
            // Ensure grid layouts work in PDF
            if (htmlEl.style.display === 'grid' || htmlEl.className.includes('grid')) {
              htmlEl.style.display = 'block';
              htmlEl.style.width = '100%';
            }
            
            // Convert flex layouts to more PDF-friendly alternatives
            if (htmlEl.style.display === 'flex') {
              if (htmlEl.style.flexDirection === 'column') {
                htmlEl.style.display = 'block';
              } else {
                htmlEl.style.display = 'table';
                htmlEl.style.width = '100%';
                const children = Array.from(htmlEl.children) as HTMLElement[];
                children.forEach(child => {
                  child.style.display = 'table-cell';
                  child.style.verticalAlign = 'top';
                });
              }
            }
          });            // Ensure the root element has proper styling
          clonedElement.style.backgroundColor = '#ffffff';
          clonedElement.style.color = '#374151';
          clonedElement.style.padding = '32px'; // Ensure padding is preserved (p-8 = 2rem = 32px)
          clonedElement.style.minHeight = '297mm'; // A4 height
          clonedElement.style.boxSizing = 'border-box';
          clonedElement.style.width = '210mm'; // A4 width
          clonedElement.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
          clonedElement.style.lineHeight = '1.6';
          clonedElement.style.overflow = 'visible';
          clonedElement.style.position = 'relative';
          
          // Ensure two-column layouts work properly
          const gridElements = clonedElement.querySelectorAll('.grid');
          gridElements.forEach(grid => {
            const htmlGrid = grid as HTMLElement;
            if (htmlGrid.className.includes('grid-cols-3')) {
              htmlGrid.style.display = 'table';
              htmlGrid.style.width = '100%';
              htmlGrid.style.tableLayout = 'fixed';
              
              const children = Array.from(htmlGrid.children) as HTMLElement[];
              children.forEach((child, index) => {
                child.style.display = 'table-cell';
                child.style.verticalAlign = 'top';
                child.style.padding = '0 8px';
                if (child.className.includes('col-span-2')) {
                  child.style.width = '66.666%';
                } else if (child.className.includes('col-span-1')) {
                  child.style.width = '33.333%';
                }
              });
            }
          });
        }
      }
    });

    console.log('Canvas created successfully', { width: canvas.width, height: canvas.height });    // Create PDF with higher quality settings
    const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
    console.log('Image data created, length:', imgData.length);
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false, // Don't compress for better quality
      precision: 2
    });

    console.log('PDF instance created');

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm (corrected from 295)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    console.log('Adding image to PDF...', { imgWidth, imgHeight, pageHeight, canvasHeight: canvas.height, canvasWidth: canvas.width });

    // Add first page with better quality settings    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST'); // Use FAST compression for better quality
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
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export CV as DOCX document
 */
export async function exportToDOCX(cvData: CVData): Promise<void> {
  try {
    const children: any[] = [];

    // Personal Information
    if (cvData.personalInfo.name) {
      children.push(
        new Paragraph({
          text: cvData.personalInfo.name,
          heading: HeadingLevel.TITLE,
          alignment: 'center',
        })
      );
    }

    // Contact information
    const contactInfo: string[] = [];
    if (cvData.personalInfo.email) contactInfo.push(cvData.personalInfo.email);
    if (cvData.personalInfo.phone) contactInfo.push(cvData.personalInfo.phone);
    if (cvData.personalInfo.location) contactInfo.push(cvData.personalInfo.location);

    if (contactInfo.length > 0) {
      children.push(
        new Paragraph({
          text: contactInfo.join(' | '),
          alignment: 'center',
        })
      );
    }

    // Links
    const links: string[] = [];
    if (cvData.personalInfo.linkedin) links.push(`LinkedIn: ${cvData.personalInfo.linkedin}`);
    if (cvData.personalInfo.github) links.push(`GitHub: ${cvData.personalInfo.github}`);
    if (cvData.personalInfo.website) links.push(`Website: ${cvData.personalInfo.website}`);

    if (links.length > 0) {
      children.push(
        new Paragraph({
          text: links.join(' | '),
          alignment: 'center',
        })
      );
    }

    // Professional Summary
    if (cvData.personalInfo.summary) {
      children.push(
        new Paragraph({ text: '' }), // Spacing
        new Paragraph({
          text: 'Professional Summary',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: cvData.personalInfo.summary,
        })
      );
    }

    // Work Experience
    if (cvData.experience.length > 0) {
      children.push(
        new Paragraph({ text: '' }), // Spacing
        new Paragraph({
          text: 'Work Experience',
          heading: HeadingLevel.HEADING_1,
        })
      );

      cvData.experience.forEach((exp) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position,
                bold: true,
              }),
              new TextRun({
                text: ` at ${exp.company}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                italics: true,
              })
            ]
          })
        );

        if (exp.location) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.location,
                  italics: true,
                })
              ]
            })
          );
        }

        if (exp.description) {
          children.push(
            new Paragraph({
              text: exp.description,
            })
          );
        }

        // Achievements
        exp.achievements.forEach((achievement) => {
          children.push(
            new Paragraph({
              text: `• ${achievement}`,
            })
          );
        });

        children.push(new Paragraph({ text: '' })); // Spacing
      });
    }

    // Education
    if (cvData.education.length > 0) {
      children.push(
        new Paragraph({
          text: 'Education',
          heading: HeadingLevel.HEADING_1,
        })
      );

      cvData.education.forEach((edu) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            text: edu.institution,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
                italics: true,
              })
            ]
          })
        );

        if (edu.gpa) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `GPA: ${edu.gpa}`,
                  italics: true,
                })
              ]
            })
          );
        }

        if (edu.description) {
          children.push(
            new Paragraph({
              text: edu.description,
            })
          );
        }

        children.push(new Paragraph({ text: '' })); // Spacing
      });
    }

    // Skills
    if (cvData.skills.length > 0) {
      children.push(
        new Paragraph({
          text: 'Skills',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: cvData.skills.join(', '),
        })
      );
    }

    // Certifications
    if (cvData.certifications.length > 0) {
      children.push(
        new Paragraph({ text: '' }), // Spacing
        new Paragraph({
          text: 'Certifications',
          heading: HeadingLevel.HEADING_1,
        })
      );

      cvData.certifications.forEach((cert) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name,
                bold: true,
              }),
              new TextRun({
                text: ` - ${cert.issuer}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: cert.date,
                italics: true,
              })
            ]
          })
        );

        if (cert.expiryDate) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Expires: ${cert.expiryDate}`,
                  italics: true,
                })
              ]
            })
          );
        }

        children.push(new Paragraph({ text: '' })); // Spacing
      });
    }

    // Languages
    if (cvData.languages.length > 0) {
      children.push(
        new Paragraph({
          text: 'Languages',
          heading: HeadingLevel.HEADING_1,
        })
      );

      cvData.languages.forEach((lang) => {
        children.push(
          new Paragraph({
            text: `${lang.name}: ${lang.proficiency}`,
          })
        );
      });
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
 * Export cover letter as PDF using the preview element
 */
export async function exportCoverLetterToPDF(letterContent: string, fileName: string = 'cover_letter.pdf'): Promise<void> {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }

    const element = document.getElementById('cover-letter-preview');
    if (!element) {
      throw new Error('Cover letter preview element not found');
    }

    console.log('Starting cover letter PDF export...', element);

    // Wait a bit for any pending renders
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create canvas from the cover letter preview element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth,
      logging: false, // Disable console logs
      removeContainer: true,
    });

    console.log('Canvas created successfully', canvas.width, canvas.height);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Error exporting cover letter to PDF:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
}

/**
 * Export cover letter as DOCX document
 */
export async function exportCoverLetterToDOCX(
  letterContent: string, 
  companyName: string = '',
  position: string = '',
  fileName: string = 'cover_letter.docx'
): Promise<void> {
  try {
    const children: any[] = [];

    // Split the letter content into paragraphs
    const paragraphs = letterContent.split('\n\n').filter(p => p.trim());

    paragraphs.forEach((paragraph) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: paragraph.trim(),
              size: 24, // 12pt font
            }),
          ],
          spacing: {
            after: 240, // Space after paragraph
          },
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
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
