import factory
from factory.faker import faker
from django.contrib.auth.hashers import make_password
from .models import User, Role


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker("email")
    username = factory.Faker("user_name")
    name = factory.Faker("name")
    role = factory.Faker("random_element", elements=[Role.USER])
    gender = factory.Faker("random_element", elements=['Male', 'Female', 'Other'])
    phoneNumber = factory.Faker("numerify", text="##########")

    is_active = True
    is_verified = False
    is_staff = False

    created_at = factory.Faker('date_time_this_year')
    updated_at = factory.Faker('date_time_this_year')

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        self.set_password('proleap')
        if extracted:
            self.set_password(extracted)