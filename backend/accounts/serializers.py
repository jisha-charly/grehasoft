import re
from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z\s]{3,50}$', value):
            raise serializers.ValidationError(
                "Name must contain only letters (min 3 characters)"
            )
        return value

    def validate_email(self, value):
        return value.lower()

    def validate_phone(self, value):
        if not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError(
                "Phone must be a valid 10-digit Indian number"
            )
        return value

    def validate_gst_no(self, value):
        if value and not re.match(
            r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$', value
        ):
            raise serializers.ValidationError("Invalid GST number")
        return value

    class Meta:
        model = Client
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "company_name",
            "gst_no",
            "address",
            "created_at",
        ]
