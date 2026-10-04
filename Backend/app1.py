import os
import json
import base64
import io

import numpy as np
import pandas as pd
import joblib
import tensorflow as tf

from PIL import Image
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from tensorflow.keras import layers
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input as mobilenet_preprocess


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_DIR = os.path.join(
    BASE_DIR,
    "model"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "indian_cattle_breed_classifier.keras"
)

CLASS_NAMES_PATH = os.path.join(
    MODEL_DIR,
    "class_names.json"
)

CONFIG_PATH = os.path.join(
    MODEL_DIR,
    "config.json"
)

MILK_MODEL_PATH = os.path.join(
    BASE_DIR,
    "milk_yield_prediction_model.pkl"
)

MILK_FEATURES = [
    "Breed",
    "Age_Months",
    "Weight_kg",
    "Parity",
    "Lactation_Stage",
    "Days_in_Milk",
    "Feed_Type",
    "Feed_Quantity_kg",
    "Water_Intake_L",
    "Grazing_Duration_hrs",
    "Rumination_Time_hrs",
    "Resting_Hours",
    "Ambient_Temperature_C",
    "Humidity_percent",
    "Season",
    "Housing_Score",
    "Previous_Week_Avg_Yield",
    "Body_Condition_Score",
    "Milking_Interval_hrs",
]


# ============================================================
# LOAD CLASS NAMES
# ============================================================

with open(
    CLASS_NAMES_PATH,
    "r",
    encoding="utf-8"
) as f:

    class_info = json.load(f)


CLASS_NAMES = class_info["class_names"]

NUM_CLASSES = len(CLASS_NAMES)


# ============================================================
# LOAD CONFIG
# ============================================================

with open(
    CONFIG_PATH,
    "r",
    encoding="utf-8"
) as f:

    config = json.load(f)


IMAGE_SIZE = tuple(
    config.get(
        "image_size",
        [224, 224]
    )
)

CONFIDENCE_THRESHOLD = config.get(
    "confidence_threshold",
    0.70
)


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="Indian Cattle Breed Classifier API",
    description="EfficientNetB0 cattle breed classification API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# BUILD MODEL
# ============================================================

def build_model():

    inputs = tf.keras.Input(
        shape=(
            IMAGE_SIZE[0],
            IMAGE_SIZE[1],
            3
        ),
        name="image"
    )


    augmentation = tf.keras.Sequential(
        [

            layers.RandomFlip(
                "horizontal"
            ),

            layers.RandomRotation(
                0.08
            ),

            layers.RandomZoom(
                0.10
            ),

            layers.RandomTranslation(
                height_factor=0.05,
                width_factor=0.05
            ),

            layers.RandomContrast(
                0.10
            ),

            layers.RandomBrightness(
                0.08
            )

        ],
        name="data_augmentation"
    )


    x = augmentation(
        inputs,
        training=False
    )


    backbone = (
        tf.keras.applications.EfficientNetB0(

            include_top=False,

            weights=None,

            input_shape=(
                IMAGE_SIZE[0],
                IMAGE_SIZE[1],
                3
            ),

            name="efficientnetb0"
        )
    )


    x = backbone(
        x,
        training=False
    )


    x = layers.GlobalAveragePooling2D(
        name="global_average_pooling2d"
    )(x)


    x = layers.BatchNormalization(
        name="batch_normalization"
    )(x)


    x = layers.Dropout(
        0.35
    )(x)


    x = layers.Dense(
        256,
        activation="relu",
        name="dense_1"
    )(x)


    x = layers.Dropout(
        0.25
    )(x)


    outputs = layers.Dense(
        NUM_CLASSES,
        activation="softmax",
        name="breed_output"
    )(x)


    model = tf.keras.Model(
        inputs=inputs,
        outputs=outputs,
        name="indian_cattle_breed_classifier"
    )


    return model, backbone


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading cattle breed model...")

model, backbone = build_model()

model.load_weights(
    MODEL_PATH
)

print("Model loaded successfully.")


# ============================================================
# LOAD MILK YIELD MODEL
# ============================================================

milk_model = None
milk_model_load_error = None
milk_category_values = {}

try:
    print("Loading milk yield model...")
    milk_model = joblib.load(MILK_MODEL_PATH)
    if list(getattr(milk_model, "feature_names_in_", [])) != MILK_FEATURES:
        raise RuntimeError(
            "Milk model feature names do not match the expected schema."
        )

    categorical_transformer = (
        milk_model.named_steps["preprocessor"]
        .named_transformers_["cat"]
        .named_steps["encoder"]
    )
    milk_category_values = {
        field: set(categories)
        for field, categories in zip(
            ["Breed", "Lactation_Stage", "Feed_Type", "Season"],
            categorical_transformer.categories_,
        )
    }
    print("Milk yield model loaded successfully.")
except Exception as exc:
    milk_model_load_error = str(exc)
    print("Milk yield model unavailable:", repr(exc))


class MilkAnalysisRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    Breed: str = Field(min_length=1)
    Age_Months: float = Field(ge=0)
    Weight_kg: float = Field(gt=0)
    Parity: int = Field(ge=0)
    Lactation_Stage: str = Field(min_length=1)
    Days_in_Milk: float = Field(ge=0)
    Feed_Type: str = Field(min_length=1)
    Feed_Quantity_kg: float = Field(ge=0)
    Water_Intake_L: float = Field(ge=0)
    Grazing_Duration_hrs: float = Field(default=4, ge=0)
    Rumination_Time_hrs: float = Field(default=8, ge=0)
    Resting_Hours: float = Field(default=10, ge=0)
    Ambient_Temperature_C: float = 28
    Humidity_percent: float = Field(default=65, ge=0, le=100)
    Season: str = Field(min_length=1)
    Housing_Score: float = Field(default=8, ge=0, le=10)
    Previous_Week_Avg_Yield: float = Field(default=10, ge=0)
    Body_Condition_Score: float = Field(ge=1, le=5)
    Milking_Interval_hrs: float = Field(default=12, gt=0)


# ============================================================
# LOAD OOD MODEL
# ============================================================

print("Loading OOD detection model (MobileNetV2)...")
ood_model = MobileNetV2(weights="imagenet", include_top=True)
print("OOD model loaded.")


# ============================================================
# GRAD-CAM LAYER
# ============================================================

conv_layers = []

for layer in backbone.layers:

    if isinstance(
        layer,
        (
            tf.keras.layers.Conv2D,
            tf.keras.layers.DepthwiseConv2D
        )
    ):

        conv_layers.append(layer)


if not conv_layers:

    raise RuntimeError(
        "No convolutional layer found."
    )


LAST_CONV_LAYER = conv_layers[-1]


feature_model = tf.keras.Model(
    inputs=backbone.input,
    outputs=[
        LAST_CONV_LAYER.output,
        backbone.output
    ]
)


# ============================================================
# CLASSIFIER HEAD
# ============================================================

gap_layer = None
bn_layer = None
dense_layers = []


for layer in model.layers:

    if isinstance(
        layer,
        tf.keras.layers.GlobalAveragePooling2D
    ):

        gap_layer = layer

    elif isinstance(
        layer,
        tf.keras.layers.BatchNormalization
    ):

        bn_layer = layer

    elif isinstance(
        layer,
        tf.keras.layers.Dense
    ):

        dense_layers.append(layer)


classifier_dense_1 = dense_layers[-2]
classifier_dense_2 = dense_layers[-1]


# ============================================================
# PREPROCESS
# ============================================================

def preprocess_image(image):

    image = image.convert(
        "RGB"
    )

    image = image.resize(
        IMAGE_SIZE,
        Image.Resampling.LANCZOS
    )

    array = np.asarray(
        image
    ).astype(
        np.float32
    )

    array = np.expand_dims(
        array,
        axis=0
    )

    return array


# ============================================================
# GRAD-CAM
# ============================================================

def generate_gradcam(
    image,
    class_index
):

    image_rgb = image.convert(
        "RGB"
    )

    resized = image_rgb.resize(
        IMAGE_SIZE,
        Image.Resampling.LANCZOS
    )

    image_array = np.asarray(
        resized
    ).astype(
        np.float32
    )

    image_array = np.expand_dims(
        image_array,
        axis=0
    )


    # --------------------------------------------------------
    # Augmentation
    # --------------------------------------------------------

    augmentation_layer = None

    for layer in model.layers:

        if (
            isinstance(
                layer,
                tf.keras.Sequential
            )
            and
            "augment" in layer.name.lower()
        ):

            augmentation_layer = layer
            break


    if augmentation_layer is not None:

        backbone_input = augmentation_layer(
            image_array,
            training=False
        )

    else:

        backbone_input = image_array


    # --------------------------------------------------------
    # Gradient calculation
    # --------------------------------------------------------

    with tf.GradientTape() as tape:

        conv_outputs, backbone_features = (
            feature_model(
                backbone_input,
                training=False
            )
        )


        x = gap_layer(
            backbone_features
        )

        x = bn_layer(
            x,
            training=False
        )

        x = classifier_dense_1(
            x
        )

        predictions = classifier_dense_2(
            x
        )

        class_score = predictions[
            :,
            class_index
        ]


    gradients = tape.gradient(
        class_score,
        conv_outputs
    )


    if gradients is None:

        raise RuntimeError(
            "Grad-CAM gradients are None."
        )


    pooled_gradients = tf.reduce_mean(
        gradients,
        axis=(0, 1, 2)
    )


    conv_outputs = conv_outputs[0]


    heatmap = tf.reduce_sum(
        conv_outputs *
        pooled_gradients,
        axis=-1
    )


    heatmap = tf.maximum(
        heatmap,
        0
    )


    max_value = tf.reduce_max(
        heatmap
    )


    if float(max_value) > 0:

        heatmap = (
            heatmap /
            max_value
        )


    heatmap = heatmap.numpy()


    # --------------------------------------------------------
    # Resize
    # --------------------------------------------------------

    heatmap_image = Image.fromarray(
        np.uint8(
            heatmap * 255
        )
    )


    heatmap_image = heatmap_image.resize(
        image_rgb.size,
        Image.Resampling.BILINEAR
    )


    # --------------------------------------------------------
    # Color map
    # --------------------------------------------------------

    import matplotlib.cm as cm

    heatmap_array = np.asarray(
        heatmap_image
    ).astype(
        np.float32
    ) / 255.0


    colored_heatmap = cm.jet(
        heatmap_array
    )[:, :, :3]


    colored_heatmap = (
        colored_heatmap * 255
    ).astype(
        np.uint8
    )


    # --------------------------------------------------------
    # Overlay
    # --------------------------------------------------------

    original = np.asarray(
        image_rgb
    ).astype(
        np.float32
    )


    overlay = (
        0.55 * original
        +
        0.45 * colored_heatmap
    )


    overlay = np.clip(
        overlay,
        0,
        255
    ).astype(
        np.uint8
    )


    return Image.fromarray(
        overlay
    )


# ============================================================
# BASE64
# ============================================================

def image_to_base64(image):

    buffer = io.BytesIO()

    image.save(
        buffer,
        format="JPEG",
        quality=90
    )

    return base64.b64encode(
        buffer.getvalue()
    ).decode(
        "utf-8"
    )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message":
            "Indian Cattle Breed Classifier API",

        "status":
            "running",

        "classes":
            NUM_CLASSES,

        "image_size":
            IMAGE_SIZE,

        "model":
            "EfficientNetB0"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": True,
        "classes": NUM_CLASSES
    }


# ============================================================
# MILK YIELD ANALYSIS
# ============================================================

@app.post("/api/milk-analysis")
def milk_analysis(request: MilkAnalysisRequest):

    if milk_model is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Milk yield model is unavailable."
                + (
                    f" {milk_model_load_error}"
                    if milk_model_load_error
                    else ""
                )
            ),
        )

    request_data = request.model_dump()

    for field_name, allowed_values in milk_category_values.items():
        if request_data[field_name] not in allowed_values:
            allowed = ", ".join(sorted(allowed_values))
            raise HTTPException(
                status_code=422,
                detail=(
                    f"Invalid value for {field_name}. "
                    f"Expected one of: {allowed}"
                ),
            )

    input_dataframe = pd.DataFrame(
        [[request_data[field] for field in MILK_FEATURES]],
        columns=MILK_FEATURES,
    )

    try:
        prediction = float(milk_model.predict(input_dataframe)[0])
    except Exception as exc:
        print("Milk prediction error:", repr(exc))
        raise HTTPException(
            status_code=500,
            detail="Milk yield prediction failed.",
        ) from exc

    if not np.isfinite(prediction):
        raise HTTPException(
            status_code=500,
            detail="Milk yield model returned an invalid prediction.",
        )

    return {
        "success": True,
        "milk_yield_l": round(prediction, 2),
    }


# ============================================================
# CATTLE OOD DETECTION
# ============================================================

def is_cattle(image):
    
    img = image.resize(
        (224, 224),
        Image.Resampling.LANCZOS
    )
    
    img_array = np.asarray(
        img
    ).astype(
        np.float32
    )
    
    img_array = np.expand_dims(
        img_array,
        axis=0
    )
    
    img_array = mobilenet_preprocess(
        img_array
    )
    
    preds = ood_model.predict(
        img_array,
        verbose=0
    )[0]
    
    top_indices = np.argsort(
        preds
    )[::-1][:5]
    
    # ImageNet classes for bovines/livestock
    cattle_classes = {
        345, 346, 347, 348, 349,
        350, 351, 352, 353
    }
    
    for idx in top_indices:
        
        if idx in cattle_classes:
            
            return True
            
    return False


# ============================================================
# PREDICT
# ============================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # --------------------------------------------------------
    # Validate file
    # --------------------------------------------------------

    allowed_types = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]


    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail=(
                "Please upload a JPG, PNG "
                "or WEBP image."
            )
        )


    try:

        # ----------------------------------------------------
        # Read image
        # ----------------------------------------------------

        contents = await file.read()


        image = Image.open(
            io.BytesIO(contents)
        ).convert(
            "RGB"
        )


        # ----------------------------------------------------
        # OOD Validation
        # ----------------------------------------------------

        if not is_cattle(image):
            
            return {
                "success": False,
                "is_cattle": False,
                "message": "No cattle detected. Please upload a clear image of a cow."
            }


        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        image_array = preprocess_image(
            image
        )


        probabilities = model.predict(
            image_array,
            verbose=0
        )[0]


        # ----------------------------------------------------
        # Top 5
        # ----------------------------------------------------

        top_indices = np.argsort(
            probabilities
        )[::-1][:5]


        predicted_index = int(
            top_indices[0]
        )


        predicted_breed = (
            CLASS_NAMES[
                predicted_index
            ]
        )


        confidence = float(
            probabilities[
                predicted_index
            ]
        )


        top5 = []


        for index in top_indices:

            top5.append(
                {
                    "rank":
                        len(top5) + 1,

                    "breed":
                        CLASS_NAMES[
                            int(index)
                        ],

                    "confidence":
                        round(
                            float(
                                probabilities[
                                    index
                                ]
                            ),
                            6
                        ),

                    "confidence_percent":
                        round(
                            float(
                                probabilities[
                                    index
                                ]
                            ) * 100,
                            2
                        )
                }
            )


        # ----------------------------------------------------
        # Grad-CAM
        # ----------------------------------------------------

        gradcam = generate_gradcam(
            image,
            predicted_index
        )


        gradcam_base64 = (
            image_to_base64(
                gradcam
            )
        )


        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return {

            "success": True,

            "breed":
                predicted_breed,

            "confidence":
                round(
                    confidence,
                    6
                ),

            "confidence_percent":
                round(
                    confidence * 100,
                    2
                ),

            "status":
                (
                    "Confident Prediction"
                    if confidence >=
                    CONFIDENCE_THRESHOLD
                    else
                    "Low Confidence"
                ),

            "top5":
                top5,

            "gradcam":
                (
                    "data:image/jpeg;base64,"
                    +
                    gradcam_base64
                ),

            "model":
                "EfficientNetB0",

            "num_classes":
                NUM_CLASSES

        }


    except Exception as e:

        print(
            "Prediction error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )