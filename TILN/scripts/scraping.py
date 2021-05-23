import wikipedia
from difflib import SequenceMatcher
import random

keywords = ['Istorie', 'Istoric', 'Descriere', 'Toponomie']
cuv_leg = ["Incepem traseul la  ", "Urmatoarea locatie este ", "Urmeaza ", "Ne indreptam apoi pe ", "In continuare mergem pe ", "Continuand suntem pe ", "Ajungem apoi la  ", "Traseul continua cu ", "Finalizand traseul ajungem pe "]


def generare_informatii(adrese):
    global stories
    stories = []
    for adresa in adrese:
        strada = adresa.split(",")[0]
        if len(adresa) > 2:
            oras = adresa.split(",")[len(adresa.split(",")) - 2].split(" ")[len(adresa.split(",")[len(adresa.split(",")) - 2].split(" ")) - 1]
        else:
            oras = ""

        first_sentence = ""
        if adresa == adrese[0]:
            first_sentence += cuv_leg[0]
        elif adresa == adrese[len(adrese) - 1]:
            first_sentence += cuv_leg[2]
        else:
            first_sentence += cuv_leg[random.randint(1, len(cuv_leg) - 2)]

        # first_sentence += strada + ", " + oras + ". "
        first_sentence += adresa

        stories.append(first_sentence)

        orase = [" " + oras]

        for ors in orase:
            try:
                story = wikipedia.page(strada + ors).summary
            except wikipedia.exceptions.PageError:
                try:
                    stories.append("Nu am gasit exact adresa ceruta si am cautat adrese similare. ")
                    story = wikipedia.page(wikipedia.search(strada + ors)[0]).summary
                except:
                    stories.append("In urma cautarilor nu am gasit nici o informatie despre " + strada + ", " + oras + ". ")
                    stories.append("-_-")
                else:
                    stories.append(story)
                    stories.append("-_-")
                    break
            except:
                stories.append("Pentru " + strada + ", " + oras + " nu am gasit informatii si nici adrese similare. ")
                stories.append("-_-")
            else:
                print(SequenceMatcher(None, wikipedia.page(strada + ors).title, strada + ors).ratio(), wikipedia.page(strada + ors).title, strada + ors)
                if SequenceMatcher(None, wikipedia.page(strada + ors).title, strada + ors).ratio() < 0.8:
                    stories.append("In cautarea informatiilor despre " + strada + ", " + oras + ", am fost redirectionati catre " + wikipedia.page(strada + ors).title + ". ")
                if story is not None:
                    stories.append(story)
                    stories.append("-_-")
                    break


def main(adrese):
    wikipedia.set_lang("ro")
    generare_informatii(adrese)
    return stories
