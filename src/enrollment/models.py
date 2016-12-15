from django.conf import settings
from django.db import models
from course.models import Course


class Enrollment(models.Model):
    OPEN_DATE_FORMAT = "%Y-%m-%d %X"

    course = models.ForeignKey(Course)
    # assignments_completed = models.IntegerField(default=0)
    #
    # course_evaluation = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='course_evaluation', null=True)
    # action_plan = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='action_plan', null=True)
    # knowledge_quiz = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='knowledge_quiz', null=True)
    # self_evaluation = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='self_evaluation', null=True)
