from bs4 import BeautifulSoup
import requests
import string
import nltk
import re
import wikipedia
#nltk.download('stopwords')


#Enter_input = input("Search: ")
#u_i = string.capwords(Enter_input)
#lista = u_i.split()
#cuvant = "_".join(lista)

#url = "https://ro.wikipedia.org/wiki/"+cuvant



def scraping(x):
    u_i = string.capwords(x)
    lista = u_i.split()
    cuvant = "_".join(lista)
    url = "https://ro.wikipedia.org/wiki/" + cuvant
    url_open = requests.get(url).text
    soup = BeautifulSoup(url_open,'lxml')
    detalii = soup()

    url_open = requests.get(url).text
    soup = BeautifulSoup(url_open,'lxml')
    #print(soup.prettify())
    print(soup.title.text)

    #data=[]
    info = []
    #s = re.compile("Paragraph")
    gdp_table = soup.find("p")
    gdp_table1 =soup.find_all("p",limit=5)
    #for element in gdp_table:
        #data= ''.join(element.findAll(text= True))
        #info.append(element.info)
    #gdp_table_data = gdp_table.tbody.find_all("tr")
    print(gdp_table.text)
    print(gdp_table1)


def html_search():
    with open('index.html','r') as html_file:
        content = html_file.read()
        soup1 = BeautifulSoup(content,'lxml')
        content_html_page = soup1.findAll('p')
        for contents in content_html_page:
            x = contents.text
            scraping(x)
            # print(url)
            print(contents.text)


def html_pro():
    url = "http://127.0.0.1:5500/index.html"
    url_open = requests.get(url).text
    soup = BeautifulSoup(url_open, 'lxml')
    detalii = soup()

    # print(soup.prettify())
    print(soup.title.text)

    # data=[]
    info = []
    # s = re.compile("Paragraph")
    gdp_table = soup.find_all("p", class_="search_item")
    print(gdp_table)
    for tag in gdp_table:
        print(tag)




# html_search()
#html_pro()
locatii = []

def generare_informatii(strazi):
    for str in strazi:
        print()
        print(wikipedia.search(str))
        print()
        print(wikipedia.page(wikipedia.search(str+"(strada)")[0]).content.split("\n\n\n"))


def primire_adrese(adrese):
    locatii = adrese
    # print(locatii)
    # print(wikipedia.search("Splaiul Bahlui Mal Drept"))
    strazi=[]
    for loc in locatii:
        strazi.append(loc.split(",")[0])
    # print(strazi)
    generare_informatii(strazi)



def print_wiki():
    # #print(wikipedia.search("Android"))
    # print("--  \n")
    # #print(wikipedia.summary("Stan Lee(name)"))
    # print("--  \n")
    # #print(wikipedia.summary("Python(programming language)"))
    # print("--  \n")
    # print(wikipedia.search("Iasi"))
    # print("--  \n")
    # print(wikipedia.search("Strada Vasile Conta"))
    # print("-- \n")
    # print(wikipedia.search("Aleea Nucului"))
    # print(wikipedia.search("Strada Toma Cozma(Iasi)"))
    # #print(wikipedia.page("Cacica").content)
    # print("--  \n")
    # #print(wikipedia.page("Bulevardul Independentei din Iasi").content)
    # print(wikipedia.search("Strada Nicolae Gane(Iasi)"))
    # print(wikipedia.page("Bulevardul_Independenței_din_Iași").content)
    # print("--  \n")
    # print(wikipedia.summary("Strada_Alexandru_Lăpușneanu_din_Iași"))
    print(wikipedia.search("Strada Sfântul Lazăr"))
    #print(wikipedia.suggest("Strada Palat din Iași"))


print_wiki()


def main(adrese):
    primire_adrese(adrese)

