from django.urls import path
from .views import (
    ContinueListView,
    MyListToggleView,
    MyListView,
    ProfileDeleteView,
    ProfileListCreateView,
)

urlpatterns = [
    path('profiles/', ProfileListCreateView.as_view(), name='profiles'),
    path('profiles/<int:pk>/', ProfileDeleteView.as_view(), name='profile-delete'),
    path('my-list/', MyListView.as_view(), name='my-list'),
    path('my-list/toggle/', MyListToggleView.as_view(), name='my-list-toggle'),
    path('continue/', ContinueListView.as_view(), name='continue'),
]
