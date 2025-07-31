export async function POST(request) {
  try {
    const body = await request.json();
    const patientId = body.Patient_ID || "unknown"; // fallback if not provided

    console.log('Received request for Patient_ID:', patientId);

    const response = {
      "Patient_ID": patientId,
      "report": {
        "metadata": {
          "Patient_ID": patientId,
          "Name": "Mary Simpson",
          "Age": 60,
          "Gender": "Female",
          "Ethnicity": "White British",
          "Marital_Status": "Widowed",
          "Occupation": {
            "Job_Title": "Retired Nurse",
            "Category": "Healthcare"
          },
          "Previous_Hernia_Repairs": [
            {
              "Type": "Inguinal Hernia Repair",
              "Date": "2015-03-22",
              "Location": "Leeds General Infirmary",
              "Method": "Open Repair"
            },
            {
              "Type": "Umbilical Hernia Repair",
              "Date": "2019-09-12",
              "Location": "St. James’s Hospital, Leeds",
              "Method": "Laparoscopic Repair"
            }
          ],
          "Medical_History": {
            "Prior_Major_Surgeries": [
              "Appendicectomy (1984, Manchester)",
              "Open Myomectomy (1989, Manchester)",
              "Caesarian Section (1992, Leeds)",
              "Caesarian Section (1994, Leeds)",
              "Caesarian Section (1997, Leeds)"
            ],
            "Diabetes": "Yes (Metformin)",
            "Smoking_Status": "Yes (10 cigarettes a day for 40 years)",
            "High_Blood_Pressure": "Yes",
            "Thyroid_Disease": "No",
            "Kidney_Disease": "No",
            "Heart_Disease_History": "No",
            "Asthma_COPD": "No",
            "Sleep_Apnoea": "No",
            "Arthritis": "Yes (Osteoarthritis in knees)",
            "Neurological_Disorder": "No",
            "Immunosuppressed": "No",
            "Cancer_History": "No",
            "Alcohol_Consumption": "Occasionally (1-2 units/week)",
            "Abdominal_Wound_Infections_Past": "Yes",
            "Serious_Infection_History": "No",
            "Stoma": "No",
            "Able_to_lie_flat_comfortably": "Yes"
          },
          "Medications": {
            "Metformin": "1g, twice a day",
            "Vit_D3": "2000 I.U., 2 tablets once a week",
            "Sertraline": "50 mg, 1 tablet once a day",
            "Lactulose": "15 ml, twice a day",
            "Lisinopril": "10 mg, once daily"
          },
          "Able_to_Lie_Flat_Comfortably": "Yes",
          "QoL_Areas_Affected": [
            "Symptoms",
            "Body Image",
            "Mental Health",
            "Relationships (social and sexual)",
            "Employment"
          ]
        },
        "detected_themes": {
          "Detected_Themes": [
            "Body Image",
            "Interpersonal Relationships"
          ],
          "Confidence_Scores": {
            "Body_Image": 0.5178912281990051,
            "Interpersonal_Relationships": 0.6385815143585205
          }
        },
        "sentiment_and_emotion_analysis": {
          "Overall_Sentiment": {
            "Label": "neutral",
            "Score": 0.889373779296875
          },
          "Top_Emotions": {
            "optimism": 0.7308868765830994,
            "anger": 0.12603998184204102,
            "sadness": 0.12183671444654465,
            "joy": 0.021236464381217957
          }
        },
        "zero_shot_classification": {
          "Frustration_or_irritability": 0.9536792039871216,
          "Social_withdrawal": 0.8978055715560913,
          "Feeling_overwhelmed": 0.8977212905883789
        },
        "qol_summary": "Based on the retrieved patient narrative excerpts, here is a concise and empathetic summary of NEWPATIENT001's Quality of Life concerns:\n\n**Physical Symptoms and Functional Limitations**:\nMary Simpson expresses concern about her body image due to the presence of a large bump that hinders her ability to engage in normal activities. She hopes to be able to enjoy life again without feeling self-conscious about her physical appearance.\n\n**Body Image Concerns**:\nMary is concerned about her body image and feels embarrassed by the large bump on her body. She wishes to participate in activities without being distracted by this issue.\n\n**Mental Health Challenges**:\nShe reports feelings of frustration, irritability, anxiety, and hopelessness. She also experiences rumination and low mood or depression. These emotions affect her ability to cope with daily tasks and interact with others.\n\n**Impact on Interpersonal Relationships**:\nHer condition affects relationships with family and friends. She mentions wanting to play with her grandchild and participate in family trips, indicating a desire for normalcy in her social life.\n\n**Employment and Financial Concerns**:\nAlthough currently retired, Mary previously had to stop working earlier than planned due to her hernia symptoms. This has caused some stress regarding her pension and long-term health management."
      }
    }


    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
