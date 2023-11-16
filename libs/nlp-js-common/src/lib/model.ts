
const modelConfig = {
    "labels": [
        "bullying_hate",
        "clean",
        "porn",
        "proxy",
        "self_harm",
        "weapons"
    ],
    "hate_model": {
        "bullying_hate": {
            "low_thresh_phrases": ["nigger", "bitch", "fat", "ugly", "cunt", "dick", "ass", "bad", "worst", "kill", "die", "fuck", "pussy", "dumb"],
            "low_thresh_value": 0.5,
            "default_thresh": 0.65,
            "reject_phrases": ["."]
        },
        "porn": {
            "low_thresh_phrases": ["sex", "porn", "fuck", "dick", "pussy", "cum", "nude", "naked", "topless", "blow job", "squirt"],
            "low_thresh_value": 0.6,
            "default_thresh": 0.9,
            "reject_phrases": ["buy bikini", "sell bikini", "sell swim suit", "bikini purchase", "wikipedia", "health", "parenthood", "webmd", "clinic", "psychology", "physiology", "biology", "gynaecology", "gynaecologist", "women bikini set"]
        },
        "self_harm": {
            "low_thresh_phrases": ["kill", "die", "sucide", "suicide", "cut", "slit", "hurt", "gun", "knife", "hang"],
            "low_thresh_value": 0.7,
            "default_thresh": 0.97,
            "reject_phrases": ["option"]
        },
        "weapons": {
            "low_thresh_phrases": ["gun", "pistol", "rifle", "shoot", "bullet", "ammo"],
            "low_thresh_value": 0.85,
            "default_thresh": 0.95,
            "reject_phrases": ["water gun", "law", "legal", "ted", "squirt gun", "toy gun", "nerf gun", "plastic gun", "nerve gun", "laser gun", "toy weapon", "toy grenade", "gun light", "gun usb", "gun drive", "pubg", "call of duty", "counter strike", "massage gun", "war", "history", "army", "military", "museum", "ww1", "ww2", "invent", "histoical", "cannon", "cannons", "wiki", "wikipedia", "study", "know", "understand", "countries", "country", "why gun"]
        }
    },
    "default_model": {
        "porn": {
            "low_thresh_phrases": ["sex", "porn", "fuck", "dick", "pussy", "cum", "nude", "naked", "topless", "blow job", "squirt"],
            "low_thresh_value": 0.6,
            "default_thresh": 0.9,
            "reject_phrases": ["diamond stud", "diamond ring", "buy bikini", "sell bikini", "sell swim suit", "bikini purchase", "wikipedia", "health", "parenthood", "webmd", "clinic", "psychology", "physiology", "biology", "gynaecology", "gynaecologist", "why orgasm", "what orgasm", "what orgasm", "parenthood", "clinic orgasm", "know orgasm", "understand orgasm", "female orgasm", "male orgasm"]
        },
        "self_harm": {
            "low_thresh_phrases": ["kill", "die", "sucide", "suicide", "cut", "slit", "hurt", "suicidal"],
            "low_thresh_value": 0.7,
            "default_thresh": 0.9,
            "reject_phrases": ["option"]
        },
        "weapons": {
            "low_thresh_phrases": ["gun", "pistol", "rifle", "shoot", "bullet", "ammo", "firearm"],
            "low_thresh_value": 0.85,
            "default_thresh": 0.9,
            "reject_phrases": ["water gun", "law", "legal", "ted", "squirt gun", "toy gun", "nerf gun", "plastic gun", "nerve gun", "laser gun", "toy weapon", "toy grenade", "gun light", "gun usb", "gun drive", "pubg", "call of duty", "counter strike", "massage gun", "war", "history", "army", "military", "museum", "ww1", "ww2", "invent", "histoical", "cannon", "cannons", "wiki", "wikipedia", "study", "know", "understand", "countries", "country", "why gun", "wwii", "wwi"]
        },
        "proxy": {
            "low_thresh_phrases": ["vpn", "proxy", "unblock", "bypass", "by pass", "blocked", "block", "network"],
            "low_thresh_value": 0.5,
            "default_thresh": 0.9,
            "reject_phrases": ["."]
        }
    },
    "file_mapping": {
        "hate_bullying":["bullying_hate", "clean"],
        "porn_accuracy_test.json": ["porn", "clean"],
        "proxy_accuracy_test.json": ["proxy", "clean"],
        "self_harm_accuracy_test.json": ["self_harm", "clean"],
        "weapons_accuracy_test.json": ["weapons", "clean"]
    },
    "accept_phrases": {
        "hate_bullying": ["whore", "nigger", "cunt", "nigga", "asshole", "nitwit", "dimwit", "retard"],
        "weapons": ["shoot gun", "buy gun", "reload gun", "how fire gun", "how shoot gun", "how reload gun"],
        "porn": ["porn video", "sex video"],
        "proxy": ["free proxy", "best proxy", "unblock website", "bypass block"]
    }
}

export { modelConfig }
