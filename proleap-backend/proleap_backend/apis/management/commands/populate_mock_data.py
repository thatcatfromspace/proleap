from django.core.management.base import BaseCommand
from apis.factories import UserFactory

class Command(BaseCommand):
    help = 'Populate database with mock users'

    def handle(self, *args, **kwargs):
        # Create admin user
        UserFactory(email='admin1@proleap.com', username='admin1', is_staff=True, is_superuser=True, password='proleap')
 
        # Create regular users
        UserFactory.create_batch(30)

        self.stdout.write(self.style.SUCCESS('Successfully populated mock users'))
