from django.contrib import admin

# Register your models here.
from .models import MeasureQty, TargetQty

admin.site.register(MeasureQty)
admin.site.register(TargetQty)