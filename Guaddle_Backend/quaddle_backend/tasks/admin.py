from django.contrib import admin

from .models import Task, Notification, Message, Favorites, File, RecentlyViewedTasks, TaskHistory

# Register your models here.

admin.site.register(Task)
admin.site.register(Notification)
admin.site.register(Message)
admin.site.register(Favorites)
admin.site.register(File)
admin.site.register(RecentlyViewedTasks)
admin.site.register(TaskHistory)
