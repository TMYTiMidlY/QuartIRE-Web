from django.db import models

class Quantity(models.Model):
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=20)
    unit = models.CharField(max_length=20)

    class Meta:
        abstract = True

class MeasureQty(Quantity):
    delta = models.FloatField()
    data = models.TextField()
    distribute = models.IntegerField(default=0)

class TargetQty(Quantity):
    expression = models.CharField(max_length=200)