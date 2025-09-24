# Developer Components

This directory contains components specifically designed for development and testing purposes. These components are only accessible through the `/dev` route and are not part of the main application.

## Components

### DevPage
The main developer page component that serves as a container for all dev tools. Accessible at `/dev`.

### DetectionTester
Component for testing the `/detect` API endpoint. Allows file uploads and displays request status.

### ResponseViewer
Component for displaying and formatting API responses from the detection endpoint. Shows both summary view and full JSON response.

### Types
TypeScript type definitions for the detection API response structure.

## Usage

Navigate to `http://localhost:3000/dev` to access the developer testing interface.

## Features

- File upload for testing detection API
- Real-time API response viewing
- JSON formatting and syntax highlighting
- Error handling and status indicators
- Clean separation from main application code