from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Create an authority user for the admin portal login"

    def add_arguments(self, parser):
        parser.add_argument("--username", default="authority")
        parser.add_argument("--email", default="admin@urbantrace.gov")
        parser.add_argument("--password", default="admin123")

    def handle(self, *args, **options):
        username = options["username"]
        email = options["email"]
        password = options["password"]

        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            user.role = "authority"
            user.set_password(password)
            user.email = email
            user.save()
            self.stdout.write(self.style.WARNING(f"Updated existing user '{username}'"))
        else:
            User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role="authority",
            )
            self.stdout.write(self.style.SUCCESS(f"Created authority user '{username}'"))

        self.stdout.write(f"  Email/username: {email}")
        self.stdout.write(f"  Password: {password}")
        self.stdout.write("  Login at: /authority/login")
