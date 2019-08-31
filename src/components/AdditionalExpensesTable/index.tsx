import * as React from 'react';
import * as classnames from 'classnames';
import { AdditionalExpense } from '@src/firebase/ducks';
import { FormattedMessage } from 'react-intl';
import downloadStrAsCsv from '@src/lib/downloadStrAsCsv';

const downloadSvg = require('@src/images/icons/ic-excel.svg');

interface AdditionalExpensesTableProps {
  selectedId: string;
  additionalExpenses: AdditionalExpense[];
}

interface AdditionalExpenseTableCallbacks {
  onSelectExpense: (exp: AdditionalExpense) => void;
  onTogglePaid: (exp: AdditionalExpense) => void;
  onEditSelected: (id: string) => void;
  onDeleteSelected: (id: string) => void;
}

const AdditionalExpensesTable = ({
  selectedId,
  additionalExpenses,
  onTogglePaid,
  onSelectExpense,
  onDeleteSelected,
  onEditSelected
}: AdditionalExpensesTableProps & AdditionalExpenseTableCallbacks) => {
  if (!additionalExpenses.length) {
    return (
      <div>
        <h2 className="title table">
          <FormattedMessage id="budget.additionalExpenses.title" />
        </h2>
        <h3 className="table">
          <FormattedMessage id="budget.additionalExpenses.subTitle" />
        </h3>
      </div>
    );
  }
  let csvContent = 'סכום,באחריות,מאיפה קונים,כולל,הוצאה';
  const addRowToCsv = (csv: string, row: string): string => `${csv}\r\n${row}`;

  const totalAmount = additionalExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div>
      <div className="table-controls">
        <h2 className="title table">
          <FormattedMessage id="budget.additionalExpenses.table.title" />
        </h2>
        <div className="icons no-print">
          <a onClick={() => downloadStrAsCsv(csvContent, 'additional-expenses.csv')}>
            <img src={downloadSvg} />
          </a>
        </div>
      </div>
      <table className="table table-light additional-expense-table">
        <thead>
          <tr className="additional-expense-row">
            <th scope="col">
              <FormattedMessage id="budget.additionalExpenses.table.expenditure" />
            </th>
            <th scope="col">
              <FormattedMessage id="budget.additionalExpenses.table.whatToBuy" />
            </th>
            <th scope="col">
              <FormattedMessage id="budget.additionalExpenses.table.whereToBuy" />
            </th>
            <th scope="col">
              <FormattedMessage id="budget.additionalExpenses.table.responsibility" />
            </th>
            <th scope="col">
              <FormattedMessage id="budget.additionalExpenses.table.amount" />
            </th>
          </tr>
        </thead>
        <tbody>
          {additionalExpenses.map((exp) => {
            csvContent = addRowToCsv(
              csvContent,
              `${exp.amount},${exp.responsible},${exp.whereToBuy},${exp.whatToBuy},${
                exp.expenditure
              }`
            );
            return (
              <tr
                key={exp.id}
                onClick={() => onSelectExpense(exp)}
                className={classnames('additional-expense-row', { active: exp.id === selectedId })}
              >
                <td>
                  <span>{exp.expenditure}</span>
                </td>
                <td>
                  <span>{exp.whatToBuy}</span>
                </td>
                <td>
                  <span>{exp.whereToBuy}</span>
                </td>
                <td>
                  <span className="capitalize">{exp.responsible}</span>
                </td>
                <td>
                  {exp.amount} ₪
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onTogglePaid(exp);
                    }}
                    className={classnames('status', { success: exp.isPaid })}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th className="additional-expense-total-row" colSpan={5}>
              {totalAmount} ₪
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default AdditionalExpensesTable;
