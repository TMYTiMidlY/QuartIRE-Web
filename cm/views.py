from django.shortcuts import render
# from django.template import loader

# Create your views here.
def index(request):
    # template = loader.get_template('cm/index.html')
    # return HttpResponse(template)
    return render(request, 'cm/index.html')