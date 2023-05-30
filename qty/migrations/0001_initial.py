# Generated by Django 3.2.16 on 2023-05-15 02:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Measurement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('symbol', models.CharField(max_length=10)),
                ('unit', models.CharField(max_length=20)),
                ('delta', models.CharField(max_length=20)),
                ('data', models.TextField()),
                ('distribute', models.IntegerField(default=0)),
                ('p_cfd', models.CharField(default='0.95', max_length=10)),
            ],
        ),
    ]