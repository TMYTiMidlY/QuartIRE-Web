# from django.template import loader

# Create your views here.
# def index(request):
#     # template = loader.get_template('cm/index.html')
#     # return HttpResponse(template)
#     return render(request, 'cm/index.html')

from django.shortcuts import render
from qty.models import MeasureQty, TargetQty
from qty.forms import QtyForm
# ...

def index(request):
    measure_qtys = MeasureQty.objects.all()
    target_qtys = TargetQty.objects.all()
    qty_form = QtyForm()
    return render(request, 'cm/index.html', {'measure_qtys': measure_qtys, 'target_qtys': target_qtys, 'qty_form': qty_form})