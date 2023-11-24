enum NLPLabel {
  HateBullying = "hate_bullying",
  Clean = "clean",
  Porn = "porn",
  Proxy = "proxy",
  SelfHarm = "self_harm",
  Weapons = "weapons"
}

interface NLPResult {
  flag: boolean,
  label: NLPLabel,
  flaggedText: string
}

export {NLPLabel, type NLPResult}
