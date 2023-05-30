from django import forms

# class MeasureQtyForm(forms.Form):
#     name = forms.CharField(max_length=50)
#     symbol = forms.CharField(max_length=10)
#     unit = forms.CharField(max_length=20)
#     delta = forms.CharField(max_length=20)
#     data = forms.CharField(widget=forms.Textarea)
#     distribute = forms.IntegerField(initial=0)
#     p_cfd = forms.CharField(max_length=10, initial='0.95')

# def clean_data(self):
#     data = self.cleaned_data['data']
#     try:
#         data_list = [float(i) for i in data.replace(',', ' ').split()]
#     except ValueError:
#         raise forms.ValidationError("数据格式不正确，请输入有效的浮点数。")
#     return data


from django import forms
from .models import MeasureQty, TargetQty

# class QtyForm(forms.Form):
#     MEASURE_CHOICES = [
#         ('measure_qty', 'MeasureQty'),
#         ('target_qty', 'TargetQty'),
#     ]

#     measure_type = forms.ChoiceField(choices=MEASURE_CHOICES, label='类型')
#     value = forms.DecimalField(label='值')

#     def save(self):
#         measure_type = self.cleaned_data['measure_type']
#         value = self.cleaned_data['value']

#         if measure_type == 'measure_qty':
#             measure_qty = MeasureQty(value=value)
#             measure_qty.save()
#         elif measure_type == 'target_qty':
#             target_qty = TargetQty(value=value)
#             target_qty.save()


class MeasureQtyForm(forms.ModelForm):
    class Meta:
        model = MeasureQty
        fields = ['name', 'symbol', 'unit', 'delta', 'data', 'distribute']
        labels = {
            'name': '名称',
            'symbol': '符号',
            'unit': '单位',
            'delta': '允差',
            'data': '数据',
            'distribute': '分布'
        }

class TargetQtyForm(forms.ModelForm):
    class Meta:
        model = TargetQty
        fields = ['name', 'symbol', 'unit', 'expression']
        labels = {
            'name': '名称',
            'symbol': '符号',
            'unit': '单位',
            'expression': '表达式'
        }

class QtyForm(forms.Form):
    quantity_type = forms.ChoiceField(choices=[('measureqty', '测量量'), ('targetqty', '目标量')])

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.measure_qty_form = MeasureQtyForm(prefix='measureqty')
        self.target_qty_form = TargetQtyForm(prefix='targetqty')

    def is_valid(self):
        is_valid = super().is_valid()
        if not is_valid:
            return False

        if self.cleaned_data['quantity_type'] == 'measureqty':
            return self.measure_qty_form.is_valid()
        else:
            return self.target_qty_form.is_valid()

    def save(self):
        if self.cleaned_data['quantity_type'] == 'measureqty':
            return self.measure_qty_form.save()
        else:
            return self.target_qty_form.save()