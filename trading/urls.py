from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('', views.dashboard, name='dashboard'),
    path('api/chart/<str:ticker>/', views.get_chart_data, name='chart_data'),
    path('api/top10-market/', views.get_top10_market_data_api, name='top10_market_data'),
    path('api/profile/', views.profile_api, name='profile_api'),
    path('api/support/', views.support_request_api, name='support_request_api'),
]
