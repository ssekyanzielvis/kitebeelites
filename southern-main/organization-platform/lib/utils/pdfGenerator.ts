import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface BudgetItem {
  item: string;
  cost: number;
}

export function downloadBudgetPDF(programTitle: string, budgetItems: BudgetItem[]) {
  if (!budgetItems || budgetItems.length === 0) return;

  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text(`${programTitle} - Estimated Budget`, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  // Table Data
  const tableData = budgetItems.map((item, index) => [
    index + 1,
    item.item,
    `UGX ${item.cost.toLocaleString()}`
  ]);

  const totalCost = budgetItems.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  
  // Add total row
  tableData.push([
    '',
    'TOTAL ESTIMATED BUDGET',
    `UGX ${totalCost.toLocaleString()}`
  ]);

  // Generate Table using jspdf-autotable
  (doc as any).autoTable({
    startY: 40,
    head: [['#', 'Item Description', 'Estimated Cost (UGX)']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 50, halign: 'right' }
    },
    didParseCell: function(data: any) {
      // Bold the total row
      if (data.row.index === tableData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        if (data.column.index === 1) {
          data.cell.styles.halign = 'right';
        }
      }
    }
  });

  // Save the PDF
  const filename = `${programTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_budget.pdf`;
  doc.save(filename);
}
