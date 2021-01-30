# https://medium.com/better-programming/how-to-properly-use-aws-s3-presigned-urls-147a449227f9

from chalice import Chalice
import boto3
import json
import os

app = Chalice(app_name='s3_presigned_file_upload')

BUCKET_NAME = os.environ["BUCKET_NAME"]
REGION = os.environ["REGION"]

@app.route('/generate_presigned_url', methods=['GET'], cors=True)
def generate_presigned_url():
    parameters = app.current_request.query_params
    file_name = parameters['file_name']

    s3_client = boto3.client("s3", region_name=REGION)

    fields = s3_client.generate_presigned_url('put_object',
                                              Params={'Bucket': BUCKET_NAME,
                                                      'Key': file_name,
                                                      'ACL': 'public-read'
                                                      },
                                              ExpiresIn=3600)

    return json.dumps({'status': 'OK', 'fields': fields})