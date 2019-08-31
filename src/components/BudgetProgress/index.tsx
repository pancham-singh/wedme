import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface BudgetProgressProps {
  isEditingBudget: boolean;
  budget: number;
  spent: number;
}

interface BudgetProgressCallbacks {
  onBudgetChange: (newBudget: number) => void;
  onStartEditingBudget: () => void;
  onStopEditingBudget: () => void;
}

const BudgetProgress = (props: BudgetProgressProps & BudgetProgressCallbacks) => {
  const consumedBudgetPercent = props.spent / props.budget * 100;
  const handleStopEdit = (e) => {
    props.onBudgetChange(Number(e.target.value));
    props.onStopEditingBudget();
  };

  const spent = props.budget ? props.spent : 0;
  const actuallyRemaining = props.budget - props.spent;
  const remaining = props.budget && actuallyRemaining >= 0 ? actuallyRemaining : 0;

  return (
    <div className="budget-status no-print">
      <h2 className="title main budget-progress-title">
        <FormattedMessage id="budget.progress.title" /> &nbsp;
        {props.isEditingBudget ? (
          <input
            className="inline-budget-input"
            autoFocus
            defaultValue={props.budget}
            type="number"
            onKeyPress={(e) => (e.key === 'Escape' || e.key === 'Enter') && handleStopEdit(e)}
            onBlur={handleStopEdit}
          />
        ) : (
          <span onClick={props.onStartEditingBudget}>{props.budget} </span>
        )}
      </h2>
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${consumedBudgetPercent}%` }}
        >
          &nbsp;
        </div>
      </div>
      <span className="title sub-light">
        <FormattedMessage id="budget.progress.statusMessage" values={{ spent, remaining }} />
      </span>
    </div>
  );
};

export default BudgetProgress;
