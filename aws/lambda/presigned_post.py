import json
import boto3

mode = "apigw" # mode can be apigw or test

s3PresignDict = {
  'Content-Type': 'image/jpeg',
  'ACL': 'public-read'
}
expiry=3600

def lambda_handler(event, context):
    if (mode == "test"):
        bucket = event['bucket']
        key = event['key']
    else:
        # Extract parameters this way because API Gateway encapsulates them (https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)
        body = json.loads(event['body'])
        bucket = body['bucket']
        key = body['key']

    try:
        presigned_post = boto3.client('s3').generate_presigned_post(
            bucket,
            key,
            Fields=s3PresignDict,
            ExpiresIn=expiry
        )
    except Exception as error:
        return str(error)
    return {
        'statusCode': 200,
        'body': json.dumps(presigned_post)
    }
