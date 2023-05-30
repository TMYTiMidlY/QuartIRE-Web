# from django.shortcuts import render
# from django.http import JsonResponse
# from .models import MeasureQty
# from .forms import MeasureQtyForm
# from .qty_processing import MeasureQty, TargetQty, Ureg, T_P, K_P, C

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import QtyForm

@csrf_exempt
def new_qty(request):
    if request.method == 'POST':
        form = QtyForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'}, status=201)
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

# def calculate(request):
#     if request.method == 'POST':
#         form = MeasureQtyForm(request.POST)

#         if form.is_valid():
#             # 获取表单数据
#             name = form.cleaned_data['name']
#             symbol = form.cleaned_data['symbol']
#             unit = form.cleaned_data['unit']
#             delta = form.cleaned_data['delta']
#             data = form.cleaned_data['data']
#             distribute = form.cleaned_data['distribute']
#             p_cfd = form.cleaned_data['p_cfd']

#             # 创建 MeasureQty 实例并处理数据
#             measure_qty = MeasureQty(
#                 name, symbol, unit, delta, data, distribute, p_cfd)

#             # ...（其他逻辑，如创建 TargetQty 实例并计算结果）

#         # # 创建 MeasureQty 实例
#         # measure_qty_list = []
#         # for measurement_data in measurements_data:
#         #     # 假设数据以逗号分隔
#         #     name, symbol, unit, delta, data, distribute, p_cfd = measurement_data.split(
#         #         ',')
#         #     measure_qty = MeasureQty(
#         #         name, symbol, unit, delta, data, int(distribute), p_cfd)
#         #     measure_qty_list.append(measure_qty)

#         # # 创建 TargetQty 实例
#         # target_data = request.POST['target']
#         # name, symbol, unit, expression = target_data.split(',')
#         # target_qty = TargetQty(name, symbol, unit, expression)

#         # # 计算目标值和不确定度
#         # target_qty.process(*measure_qty_list)

#             response_data = {
#                 'value': str(target_qty.value.magnitude),
#                 'uncertainty': str(target_qty.value.uncertainty.magnitude),
#                 'unit': str(target_qty.value.units)
#             }
#             return JsonResponse(response_data)

#         else:
#             # 表单验证失败，返回错误信息
#             errors = form.errors.as_data()
#             response_data = {field: [str(error) for error in errors_list]
#                              for field, errors_list in errors.items()}
#             return JsonResponse(response_data, status=400)

#     else:
#         form = MeasurementForm()

#     return render(request, 'qty/calculate.html', {'form': form})
