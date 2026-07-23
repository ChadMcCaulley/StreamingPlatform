from django.urls import path
from .views import CatalogHomeView, TitleDetailView, TitleListView

urlpatterns = [
    path('catalog/home/', CatalogHomeView.as_view(), name='catalog-home'),
    path('catalog/', TitleListView.as_view(), name='catalog-list'),
    path('catalog/<slug:slug>/', TitleDetailView.as_view(), name='catalog-detail'),
]
