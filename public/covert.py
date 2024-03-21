import json

music = [];

with open("music.json", "r") as load_f:
    musicJson = json.load(load_f)
    for x in range(0, len(musicJson)):
        dictionary = musicJson[x];
        if len(dictionary.get('n')):
            newDict = {};
            newDict['name'] = dictionary.get('n')
            newDict['url'] = dictionary.get('u')
            music.append(newDict)

with open("db.json", "w") as f:
    json.dump(music, f, ensure_ascii=False)
    print("Covert finished")
