# Generated by Django 5.1.1 on 2024-10-23 23:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0002_restaurant_profile_picture_alter_dish_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='contact_info',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]
