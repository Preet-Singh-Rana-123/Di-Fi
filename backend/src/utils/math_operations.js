const find_owner_cut = (total_installment, commision_pact) => {
    const ans = total_installment * (commision_pact / 100);
    return Math.floor(ans);
};

const find_contributers_cut = (
    total_liquidity,
    amount_contributed,
    amount_to_distribute,
) => {
    const ans = (amount_contributed / total_liquidity) * amount_to_distribute;
    return Math.floor(ans);
};

module.exports = { find_contributers_cut, find_owner_cut };
