from django.urls import path
from . import views

urlpatterns = [
    path('new-qty/', views.new_qty, name='new_qty'),
    # path('new-process/', )

]
