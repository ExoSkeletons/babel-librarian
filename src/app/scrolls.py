import json
import os
from google import genai

config = {
    'api_key': os.environ.get('GENAI_API_KEY', None),
    'model': 'gemini-3.5-flash',
}

def lambda_handler(event, context):
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
    }

    if not config['api_key']:
        return {
            'statusCode': 500, 
            'headers': cors_headers,
            'body': json.dumps({
                'error': 'Missing API key'
            })
        }

    body = json.loads(event.get('body', "{}"))
    q = body.get('query', None)
    if not q:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({
                'error': 'Missing query'
            })
        }
    system = body.get('system', None)

    client = genai.Client(api_key=config['api_key'])
    
    interaction = client.interactions.create(
        model=config.get('model', 'gemini-3.5-flash'),
        system_instruction=system,
        input=q
    )

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({
            'response': interaction.output_text
        })
    }