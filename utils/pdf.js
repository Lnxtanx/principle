import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF({ teacherDetails, reportData, containerId }) {
    try {
        console.log('Starting simplified PDF generation...');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // Add header
        pdf.setFillColor(59, 130, 246);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        pdf.setFontSize(18);
        pdf.setTextColor(255, 255, 255);
        pdf.text('Lesson Completion Report', pageWidth / 2, 20, { align: 'center' });

        let yPosition = 50;

        // Get report data and generate text-based content
        if (reportData && Array.isArray(reportData)) {
            // Summary section
            pdf.setFontSize(16);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Summary Statistics', margin, yPosition);
            yPosition += 15;

            const totalClasses = reportData.length;
            const totalLessons = reportData.reduce((sum, classData) => sum + (classData.lessons?.length || 0), 0);
            const completedLessons = reportData.reduce((sum, classData) => 
                sum + (classData.lessons?.filter(l => l.status === 'Completed')?.length || 0), 0
            );
            const avgCompletion = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            pdf.setFontSize(12);
            pdf.text(`Teacher: ${teacherDetails?.name || teacherDetails?.teacherName || 'Unknown'}`, margin, yPosition);
            yPosition += 10;
            pdf.text(`Total Classes: ${totalClasses}`, margin, yPosition);
            yPosition += 10;
            pdf.text(`Total Lessons: ${totalLessons}`, margin, yPosition);
            yPosition += 10;
            pdf.text(`Completed Lessons: ${completedLessons}`, margin, yPosition);
            yPosition += 10;
            pdf.text(`Completion Rate: ${avgCompletion}%`, margin, yPosition);
            yPosition += 20;

            // Class details
            pdf.setFontSize(16);
            pdf.text('Class Details', margin, yPosition);
            yPosition += 15;

            reportData.forEach((classData, index) => {
                // Check for new page
                if (yPosition > pageHeight - 60) {
                    pdf.addPage();
                    yPosition = margin;
                }

                const lessons = classData.lessons || [];
                const completed = lessons.filter(l => l.status === 'Completed').length;
                const total = lessons.length;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                pdf.setFontSize(14);
                pdf.setTextColor(59, 130, 246);
                pdf.text(`${classData.className}`, margin, yPosition);
                yPosition += 12;

                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);
                pdf.text(`Progress: ${completed}/${total} lessons (${percentage}%)`, margin + 5, yPosition);
                yPosition += 15;

                // List lessons
                if (lessons.length > 0) {
                    lessons.forEach((lesson, lessonIndex) => {
                        if (yPosition > pageHeight - 40) {
                            pdf.addPage();
                            yPosition = margin;
                        }

                        const status = lesson.status === 'Completed' ? '✓' : '○';
                        const date = lesson.submittedAt ? 
                            ` (${new Date(lesson.submittedAt).toLocaleDateString()})` : '';
                        
                        pdf.setFontSize(9);
                        pdf.text(`  ${status} ${lesson.lessonName}${date}`, margin + 10, yPosition);
                        yPosition += 8;
                    });
                }
                yPosition += 10;
            });
        }

        // Save the PDF
        const fileName = `Teacher_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        
        console.log('PDF generated successfully');
        return true;

    } catch (err) {
        console.error('Error generating PDF:', err);
        throw new Error(`PDF generation failed: ${err.message}`);
    }
}
t