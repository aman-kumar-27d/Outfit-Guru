# Project Synopsis: Outfit Guru - AI-Powered Fashion Advisor

## 1. Introduction

Outfit Guru is an intelligent web application designed to serve as a personal fashion advisor. It addresses the common challenge of style uncertainty by providing users with instant, data-driven feedback on their outfits. By leveraging a sophisticated pipeline of computer vision and generative AI, the application analyzes user-uploaded images to detect clothing items, assess style compatibility, and offer personalized recommendations for improvement. The project's mission is to democratize fashion expertise, making insightful style guidance accessible to everyone.

## 2. Objectives

The primary objectives of the Outfit Guru project are:
- **To Develop an Accurate Detection System**: Create a robust AI engine capable of accurately identifying a wide range of clothing items, accessories, and their attributes (e.g., color) from an image.
- **To Provide Intelligent Analysis**: Utilize Large Language Models (LLMs) to generate human-like, qualitative feedback on an outfit's strengths, weaknesses, and overall aesthetic.
- **To Offer Actionable Recommendations**: Build a hybrid recommendation system that suggests specific items to enhance or complete an outfit, tailored to the user's selected occasion (e.g., casual, party, formal).
- **To Ensure User Privacy**: Implement automatic face-blurring technology to protect user identity and ensure a safe and private experience.
- **To Deliver a Seamless User Experience**: Design an intuitive, responsive, and engaging user interface that makes the process of getting fashion advice simple and enjoyable.

## 3. Technical Architecture

The system is built on a modern, decoupled client-server architecture.

### Backend
- **Framework**: **FastAPI (Python)**, chosen for its high performance, asynchronous capabilities, and automatic API documentation.
- **Machine Learning Pipeline**:
    - **Object Detection**: An ensemble of **YOLOv8** models, including a custom-trained fashion model (`YoloF.pt`), provides comprehensive detection of clothing and accessories.
    - **Image Processing**: **OpenCV** and **MTCNN** are used for critical pre-processing tasks, including mandatory face blurring for privacy.
    - **Refined Classification**: A **zero-shot classifier** (from Hugging Face) refines generic detections into specific categories (e.g., identifying "clothing" as a "denim jacket").
    - **AI Analysis & Recommendation**: The **Perplexity API** is integrated to power the LLM-based outfit analysis and generate creative recommendations. A rule-based engine provides supplemental, occasion-specific suggestions.

### Frontend
- **Framework**: **React (with TypeScript)** and **Vite**, providing a fast, modern, and type-safe development environment.
- **Styling**: **Tailwind CSS** is used for a utility-first approach to building a clean and responsive user interface.
- **User Interface**: The application features a single-page design with distinct components for image upload, detection visualization, and displaying the final analysis. It includes a version switcher (`v1`/`v2`) to allow users to compare different detection algorithms.

## 4. Key Features

- **Dual-Version Detection Engine**: Users can switch between a standard detection model (v1) and an advanced, classifier-refined model (v2) for higher accuracy.
- **Privacy-First Design**: All uploaded images undergo automatic face detection and blurring before any analysis is performed.
- **Comprehensive Outfit Analysis**: The AI provides a holistic review, including an overall description, a list of positive and negative aspects, and suggestions for missing items.
- **Hybrid Recommendation System**: Combines the creativity of LLMs with the reliability of a rule-based system to offer relevant and inspiring fashion advice.
- **Interactive UI**: A rich user interface that visualizes detected items, their bounding boxes, and dominant colors directly on the user's image.
- **Built-in Documentation**: A dedicated documentation section provides developers and users with guides, API references, and quickstart information.

## 5. Conclusion

Outfit Guru stands at the intersection of fashion and artificial intelligence, offering a practical solution to a common consumer pain point. By integrating an advanced, multi-stage AI pipeline with a user-friendly web interface, the project successfully delivers a powerful tool for personal style improvement. The architecture is designed to be scalable and extensible, laying the groundwork for future enhancements such as personalized user profiles, e-commerce integration, and even more sophisticated machine learning-driven recommendations.
