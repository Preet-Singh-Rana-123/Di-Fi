/**
 * Financial Math Utility for P2P Lending & Fractional Reserve Banking
 */

/**
 * Calculates Monthly Equated Installment (EMI) for a loan using standard amortization:
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * 
 * @param {number} principal Principal loan amount
 * @param {number} annualRatePct Annual interest rate percentage (e.g. 12 for 12%)
 * @param {number} termMonths Term in months
 * @returns {number} Monthly installment rounded to 2 decimal places
 */
function calculateMonthlyInstallment(principal, annualRatePct, termMonths) {
    const p = parseFloat(principal);
    const r = (parseFloat(annualRatePct) / 100) / 12; // monthly rate
    const n = parseInt(termMonths, 10);

    if (r === 0) {
        return Math.round((p / n) * 100) / 100;
    }

    const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi * 100) / 100;
}

/**
 * Calculates total repayable amount for EMI schedule
 */
function calculateTotalRepayable(monthlyInstallment, termMonths) {
    return Math.round((monthlyInstallment * termMonths) * 100) / 100;
}

/**
 * Splits an installment payment into interest portion and principal portion.
 * Interest portion for current period = (Remaining Principal * Annual Rate / 12)
 * Principal portion = Payment - Interest portion
 */
function calculateRepaymentSplit(remainingPrincipal, annualRatePct, paymentAmount) {
    const rem = parseFloat(remainingPrincipal);
    const r = (parseFloat(annualRatePct) / 100) / 12;
    const payment = parseFloat(paymentAmount);

    let interestPortion = Math.round((rem * r) * 100) / 100;
    if (interestPortion > payment) {
        interestPortion = payment;
    }

    let principalPortion = Math.round((payment - interestPortion) * 100) / 100;
    if (principalPortion > rem) {
        principalPortion = rem;
    }

    return {
        interestPortion,
        principalPortion
    };
}

/**
 * Distributes interest yield between bank owner commission and LP contributors.
 * LPs receive shares proportional to their contribution / total pool liquidity.
 * 
 * @param {number} totalInterestPortion Total interest collected
 * @param {number} ownerCommissionPct Owner commission percentage
 * @param {Array<{user_id: number, amount_contributed: string|number}>} contributors List of LPs
 * @param {number} totalLiquidity Total pool liquidity
 * @returns {{ownerFee: number, poolYield: number, distributions: Array<{user_id: number, share: number}>}}
 */
function distributeYield(totalInterestPortion, ownerCommissionPct, contributors, totalLiquidity) {
    const interest = parseFloat(totalInterestPortion);
    const commPct = parseFloat(ownerCommissionPct);
    const totLiq = parseFloat(totalLiquidity);

    if (interest <= 0) {
        return { ownerFee: 0, poolYield: 0, distributions: [] };
    }

    const ownerFee = Math.round((interest * (commPct / 100)) * 100) / 100;
    const poolYield = Math.round((interest - ownerFee) * 100) / 100;

    const distributions = [];
    let distributedSum = 0;

    if (totLiq > 0 && contributors.length > 0) {
        for (let i = 0; i < contributors.length; i++) {
            const contrib = contributors[i];
            const contribAmt = parseFloat(contrib.amount_contributed);
            
            // Proportional share
            let share = Math.round(((contribAmt / totLiq) * poolYield) * 100) / 100;
            
            // Adjust last contributor for rounding penny differences
            if (i === contributors.length - 1) {
                const remainingToDistribute = Math.round((poolYield - distributedSum) * 100) / 100;
                if (remainingToDistribute > 0) {
                    share = remainingToDistribute;
                }
            }

            distributedSum += share;
            if (share > 0) {
                distributions.push({
                    user_id: contrib.user_id,
                    share
                });
            }
        }
    }

    return {
        ownerFee,
        poolYield,
        distributions
    };
}

module.exports = {
    calculateMonthlyInstallment,
    calculateTotalRepayable,
    calculateRepaymentSplit,
    distributeYield
};
