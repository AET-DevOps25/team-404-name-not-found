import base64
import logging

from langchain_openai import ChatOpenAI

from app.models.ingredients import Ingredients
from app.utils.prometheus_token_callback import PrometheusTokenCallback

logger = logging.getLogger(__name__)


class ImageService:

    def __init__(self):
        self.llm = ChatOpenAI(
            model="gemma3:27b", temperature=0.1, callbacks=[PrometheusTokenCallback()]
        )
        self.llm = self.llm.with_structured_output(Ingredients, strict=True)

    async def analyze_fridge(self, image_base64: str) -> Ingredients:
        message = {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "You are given an image of a fridge. "
                    "Describe every ingredient that can be used for recipes according to the output format. "
                    "The name of the ingredient has to be as specific as possible"
                    "Choose the correct unit to match the ingredient eg. fluids in ml etc. "
                    "If there are multiple pieces of the same ingredient but pcs is not the correct unit you are allowed to add them up together",
                },
                {
                    "type": "image",
                    "source_type": "base64",
                    "data": image_base64,
                    "mime_type": "image/jpeg",
                },
            ],
        }
        ingredients = self.llm.invoke([message])
        return ingredients


# only local testing
def image_to_base64(path: str) -> str:
    """
    Reads the image at `path` in binary mode and returns
    a Base64‐encoded string (without newlines).
    """
    with open(path, "rb") as img_file:
        # read the binary data
        img_bytes = img_file.read()
        # encode to base64 bytes, then decode to str
        base64_str = base64.b64encode(img_bytes).decode("utf-8")
    return base64_str


# image = image_to_base64("AdobeStock_362239242-min.jpeg")
# load_dotenv()
# image_service = ImageService()
# image_service.analyze_fridge(image)
