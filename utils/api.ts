// Mock API functions for YouTube summarizer app

import { useAccessToken } from "@nhost/react";
import { useState } from "react";

// Mock function to summarize a YouTube video
export const mockSummarizeVideo = async (videoUrl: string, userId: string) => {
  // Simulate API call delay
  
  try {
    // In a real app, this would make an API call to your backend
    // which would then:
    // 1. Extract the video ID from the URL
    // 2. Use YouTube API to get video details and transcript
    // 3. Send the transcript to a summarization API (e.g., OpenAI)
    // 4. Return the summary and save it to the user's history
    
    // For this mock, we'll generate a fake summary based on the URL
    const response = await fetch('https://wjrjdxentwfwpiqnwlph.hasura.ap-south-1.nhost.run/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-role': 'user',
        'authorization': `Bearer ${userId}`
      },
      body: JSON.stringify({
        "query": "mutation MyCustomActionMutation($arg1: SampleInput!){ actionName(arg1: $arg1) {message} }",
        "variables": { "arg1":{"ytube": videoUrl}}
      })
    });

    const result = await response.json();

    saveToHistory(userId, videoUrl, result);
    
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error('Error summarizing video:', error);
    return {
      success: false,
      message: 'Failed to summarize video'
    };
  }
};

// Mock function to fetch user history
export const fetchUserHistory = async (userId: string) => {
  // Simulate API call delay
  
  try {
    // In a real app, this would fetch from your backend API
    // For this mock, we'll return some fake history items
    
    // Get history from localStorage or generate fake data
    const res = await fetch('https://wjrjdxentwfwpiqnwlph.hasura.ap-south-1.nhost.run/api/rest/summaries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-role': 'user',
        'authorization': `Bearer ${userId}`
      }
    });

    const data = await res.json();
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching history:', error);
    return {
      success: false,
      message: 'Failed to load history',
      data: []
    };
  }
};

// Helper function to extract video ID from YouTube URL
const extractVideoId = (url: string): string | null => {
  // Handle youtube.com URLs
  let match = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (match) return match[1];
  
  // Handle youtu.be URLs
  match = url.match(/youtu\.be\/([^?]+)/);
  if (match) return match[1];
  
  // Handle youtube.com/embed URLs
  match = url.match(/youtube\.com\/embed\/([^?]+)/);
  if (match) return match[1];
  
  return null;
};

// Helper function to generate a fake summary
const generateFakeSummary = (videoId: string): string => {
  const summaries = [
    "This video explores the fundamentals of machine learning, covering supervised and unsupervised learning techniques. The presenter explains how neural networks process data through multiple layers to recognize patterns and make predictions. Key concepts include backpropagation, gradient descent, and the importance of quality training data.",
    
    "The speaker discusses climate change impacts, highlighting rising sea levels, extreme weather events, and biodiversity loss. Scientific evidence shows human activities are the primary driver through greenhouse gas emissions. The video presents potential solutions including renewable energy transition, sustainable agriculture, and policy changes.",
    
    "This tutorial demonstrates how to build a responsive website using modern CSS techniques. It covers flexbox and grid layouts, media queries for different screen sizes, and CSS variables for consistent theming. The instructor shows practical examples of common UI components and best practices for performance optimization.",
    
    "The video analyzes recent economic trends, focusing on inflation causes and central bank responses. It explains how supply chain disruptions, monetary policy, and consumer behavior interact to affect prices. The presenter discusses potential future scenarios and strategies for financial planning during economic uncertainty.",
    
    "This documentary explores space exploration achievements and future missions. It covers the history from early rockets to the International Space Station and Mars rovers. Scientists explain upcoming projects including lunar bases, asteroid mining, and the search for extraterrestrial life. The video highlights how space technology benefits everyday life on Earth."
  ];
  
  // Use the video ID to deterministically select a summary
  const index = videoId.charCodeAt(0) % summaries.length;
  return summaries[index];
};

// Helper function to save to history (mock)
export const saveToHistory = async (userId: string, videoUrl: string, summary: any) => {
  // In a real app, this would be an API call to your backend
  // For this mock, we'll just log it
  await fetch('https://wjrjdxentwfwpiqnwlph.hasura.ap-south-1.nhost.run/api/rest/summaries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-role': 'user',
      'authorization': `Bearer ${userId}`
    },
    body: JSON.stringify({
      "object":{
          "summary": summary?.data?.actionName?.message,
          "url": videoUrl,
          "timestamp": new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000).toISOString().replace('Z', '000'),
          "user_id": userId,
      }
    })
  });
  
  // In a real implementation, you would store this in a database
};

// Helper function to get mock history
const getMockHistory = (userId: string) => {
  // In a real app, this would fetch from your backend API
  // For this mock, we'll return some fake history items
  
  return [
    {
      id: '1',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoTitle: 'Understanding Machine Learning Fundamentals',
      summary: 'This video explores the fundamentals of machine learning, covering supervised and unsupervised learning techniques. The presenter explains how neural networks process data through multiple layers to recognize patterns and make predictions.',
      timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: '2',
      videoUrl: 'https://www.youtube.com/watch?v=abc123',
      videoTitle: 'Climate Change: Causes and Solutions',
      summary: 'The speaker discusses climate change impacts, highlighting rising sea levels, extreme weather events, and biodiversity loss. Scientific evidence shows human activities are the primary driver through greenhouse gas emissions.',
      timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: '3',
      videoUrl: 'https://www.youtube.com/watch?v=xyz789',
      videoTitle: 'Modern Web Development Techniques',
      summary: 'This tutorial demonstrates how to build a responsive website using modern CSS techniques. It covers flexbox and grid layouts, media queries for different screen sizes, and CSS variables for consistent theming.',
      timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: '4',
      videoUrl: 'https://www.youtube.com/watch?v=def456',
      videoTitle: 'Economic Trends and Analysis 2025',
      summary: 'The video analyzes recent economic trends, focusing on inflation causes and central bank responses. It explains how supply chain disruptions, monetary policy, and consumer behavior interact to affect prices.',
      timestamp: new Date(Date.now() - 604800000).toISOString() // 1 week ago
    }
  ];
};