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
    const element = document.getElementById(previewElementId);
    if (!element) {
      throw new Error('Preview element not found');
    }

    // Create canvas from the CV preview element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth,
    });

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
    const fileName = `${cvData.personalInfo.name || 'CV'}_Resume.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF. Please try again.');
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
