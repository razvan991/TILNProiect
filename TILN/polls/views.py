from django.shortcuts import render, redirect
from scripts import scraping


def index(request):
    if request.method == 'POST' and 'web_scraping' in request.POST:
        global adrese
        adrese = []
        for adresa in request.POST:
            if adresa != "csrfmiddlewaretoken" and adresa != "web_scraping":
                adrese.append(request.POST[adresa])

        return redirect('story.html')

    return render(request, 'index.html')


def story(request):
    scraping.main(adrese)
    return render(request, 'story.html', {'adrese': adrese})
