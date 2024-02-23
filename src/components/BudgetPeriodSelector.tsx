import { useState } from "react";

type BudgetPeriod = "daily" | "weekly" | "monthly" | "yearly";

interface BudgetPeriodSelectorProps {
  selectedPeriod: BudgetPeriod;
  onSelectPeriod: (period: BudgetPeriod) => void;
}

const BudgetPeriodSelector: React.FC<BudgetPeriodSelectorProps> = ({ selectedPeriod, onSelectPeriod }) => {
  return (
    <div className="flex items-center gap-4">
      {(["daily", "weekly", "monthly", "yearly"] as BudgetPeriod[]).map((period) => (
        <label key={period} className="flex items-center gap-2 cursor-pointer">
          <input
            className="sr-only"
            type="radio"
            name="budgetPeriod"
            value={period}
            checked={selectedPeriod === period}
            onChange={() => onSelectPeriod(period)}
          />
          <span
            className={`inline-block h-4 w-4 rounded-full cursor-pointer bg-blue-200 ${selectedPeriod === period ? 'border-2 border-blue-800 bg-blue-800' : ''}`}
            ></span>
          <span>
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </span>
        </label>
      ))}
    </div>
  );
};

export default BudgetPeriodSelector;