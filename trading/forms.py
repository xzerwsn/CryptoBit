from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from .models import Trade, UserProfile


User = get_user_model()

AUTH_INPUT_CLASS = "auth-input"
AUTH_HELP_CLASS = "auth-help"


class StyledFormMixin:
    def _apply_auth_styles(self):
        for field in self.fields.values():
            field.widget.attrs.setdefault("class", AUTH_INPUT_CLASS)
            field.widget.attrs.setdefault("placeholder", field.label)
            field.label_suffix = ""
            if field.help_text:
                field.help_text = f'<span class="{AUTH_HELP_CLASS}">{field.help_text}</span>'


class LoginForm(StyledFormMixin, AuthenticationForm):
    username = forms.CharField(
        label="Имя пользователя",
        widget=forms.TextInput(attrs={"autocomplete": "username"}),
    )
    password = forms.CharField(
        label="Пароль",
        strip=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "current-password"}),
    )

    error_messages = {
        "invalid_login": "Неверное имя пользователя или пароль.",
        "inactive": "Этот аккаунт отключен.",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._apply_auth_styles()


class RegistrationForm(StyledFormMixin, UserCreationForm):
    first_name = forms.CharField(label="Имя", max_length=150)
    last_name = forms.CharField(label="Фамилия", max_length=150, required=False)
    email = forms.EmailField(label="Email")
    nickname = forms.CharField(label="Псевдоним", max_length=80, required=False)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "first_name", "last_name", "email", "nickname", "password1", "password2")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].label = "Имя пользователя"
        self.fields["password1"].label = "Пароль"
        self.fields["password2"].label = "Подтверждение пароля"
        self.fields["username"].help_text = (
            "Обязательно. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_."
        )
        self.fields["password1"].help_text = (
            "<ul>"
            "<li>Пароль не должен быть слишком похож на другие ваши данные.</li>"
            "<li>Пароль должен содержать не менее 8 символов.</li>"
            "<li>Пароль не должен быть слишком простым и распространенным.</li>"
            "<li>Пароль не может состоять только из цифр.</li>"
            "</ul>"
        )
        self.fields["username"].widget.attrs["autocomplete"] = "username"
        self.fields["first_name"].widget.attrs["autocomplete"] = "given-name"
        self.fields["last_name"].widget.attrs["autocomplete"] = "family-name"
        self.fields["email"].widget.attrs["autocomplete"] = "email"
        self.fields["password1"].widget.attrs["autocomplete"] = "new-password"
        self.fields["password2"].widget.attrs["autocomplete"] = "new-password"
        self._apply_auth_styles()

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("Пользователь с таким email уже существует.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data["first_name"].strip()
        user.last_name = self.cleaned_data["last_name"].strip()
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
            UserProfile.objects.create(
                user=user,
                nickname=self.cleaned_data["nickname"].strip(),
                email_visibility=UserProfile.VISIBILITY_PRIVATE,
                phone_visibility=UserProfile.VISIBILITY_PRIVATE,
                full_name_visibility=UserProfile.VISIBILITY_PUBLIC,
                theme=UserProfile.THEME_DARK,
            )
        return user


class SupportRequestForm(forms.Form):
    subject = forms.CharField(label="Тема", max_length=180)
    message = forms.CharField(label="Сообщение", max_length=4000, widget=forms.Textarea)
    contact_email = forms.EmailField(label="Email для ответа", required=False)

    def clean_subject(self):
        return self.cleaned_data["subject"].strip()

    def clean_message(self):
        return self.cleaned_data["message"].strip()

    def clean_contact_email(self):
        return self.cleaned_data.get("contact_email", "").strip().lower()


class TradeForm(forms.ModelForm):
    total_amount = forms.CharField(
        label="Итоговая сумма ($)",
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "form-control bg-dark text-white border-secondary",
                "id": "input_total",
                "readonly": "readonly",
            }
        ),
    )

    class Meta:
        model = Trade
        fields = ["asset", "trade_type", "amount", "price", "total_amount"]
        widgets = {
            "asset": forms.Select(
                attrs={
                    "class": "form-select bg-dark text-white border-secondary",
                    "id": "select_asset",
                }
            ),
            "trade_type": forms.Select(
                attrs={
                    "class": "form-select bg-dark text-white border-secondary",
                }
            ),
            "amount": forms.NumberInput(
                attrs={
                    "class": "form-control bg-dark text-white border-secondary",
                    "id": "input_amount",
                }
            ),
            "price": forms.NumberInput(
                attrs={
                    "class": "form-control bg-dark text-white border-secondary",
                    "id": "input_price",
                    "readonly": "readonly",
                }
            ),
        }
