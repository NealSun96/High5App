# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('question_body', models.TextField()),
                ('answer_keys', models.TextField()),
                ('right_answer', models.TextField(default=b'', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
