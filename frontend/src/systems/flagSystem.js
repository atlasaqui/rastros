export function meets(item, save) {
  return (
    (!item.requiresFlag || save.flags[item.requiresFlag]) &&
    (item.requiresFlags || []).every((f) => save.flags[f])
  );
}
export function effects(save, effect = {}) {
  const flags = { ...save.flags };
  for (const flag of effect.flags || []) flags[flag] = true;
  if (effect.setFlag) flags[effect.setFlag] = true;
  return { ...save, flags };
}
