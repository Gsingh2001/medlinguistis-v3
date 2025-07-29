export async function POST(request) {
  try {
    const body = await request.json();
    const patientId = body.Patient_ID || "unknown"; // fallback if not provided

    console.log('Received request for Patient_ID:', patientId);

    const response = {
      Patient_ID: patientId,
      report: {
        metadata: {
          Patient_ID: patientId,
          Name: "MARYSIMPSON",
          Age: 60,
          Gender: "Female",
          Ethnicity: "N/A",
          Marital_Status: "N/A",
          Occupation: {
            Job_Title: "N/A",
            Category: "N/A"
          },
          Previous_Hernia_Repairs: [],
          Medical_History: {
            Prior_Major_Surgeries: [
              "Appendicectomy (1984, Manchester)",
              "Open Myomectomy (1989, Manchester)",
              "Caesarian Section (1992, Leeds)",
              "Caesarian Section (1994, Leeds)",
              "Caesarian Section (1997, Leeds)"
            ],
            Diabetes: "Yes (Metformin)",
            Smoking_Status: "Yes (10 cigarettes a day for 40 years)",
            High_Blood_Pressure: "Yes",
            Thyroid_Disease: "No",
            Kidney_Disease: "No",
            Heart_Disease_History: "No",
            Asthma_COPD: "No",
            Sleep_Apnoea: "No",
            Arthritis: "No",
            Neurological_Disorder: "No",
            Immunosuppressed: "No",
            Cancer_History: "No",
            Alcohol_Consumption: "No",
            Abdominal_Wound_Infections_Past: "Yes",
            Serious_Infection_History: "Don't know",
            Stoma: "No",
            Able_to_lie_flat_comfortably: "Yes"
          },
          Medications: {
            Metformin: "1g, twice a day",
            Vit_D3: "2000 I.U., 2 tablets once a week",
            Sertraline: "50 mg, 1 tablet once a day",
            Lactulose: "15 ml, twice a day"
          },
          Able_to_Lie_Flat_Comfortably: "N/A",
          QoL_Areas_Affected: [
            "Symptoms",
            "Body Image",
            "Mental Health",
            "Relationships (social and sexual)",
            "Employment"
          ]
        },
        detected_themes: {
          Detected_Themes: [
            "Body Image",
            "Interpersonal Relationships"
          ],
          Confidence_Scores: {
            Body_Image: 0.5178912281990051,
            Interpersonal_Relationships: 0.6385815143585205
          }
        },
        sentiment_and_emotion_analysis: {
          Overall_Sentiment: {
            Label: "neutral",
            Score: 0.889373779296875
          },
          Top_Emotions: {
            optimism: 0.7308868765830994,
            anger: 0.12603998184204102,
            sadness: 0.12183671444654465,
            joy: 0.021236464381217957
          }
        },
        zero_shot_classification: {
          Frustration_or_irritability: 0.9536792039871216,
          Social_withdrawal: 0.8978055715560913,
          Feeling_overwhelmed: 0.8977212905883789
        },
        qol_summary: `Based on the retrieved patient narrative excerpts, here is a concise and empathetic summary of ${patientId}'s Quality of Life concerns:

**Physical Symptoms and Functional Limitations**:
${patientId} expresses concern about their body image due to the presence of a large bump that hinders their ability to engage in normal activities. They hope to be able to enjoy life again without feeling self-conscious about their physical appearance.

**Body Image Concerns**:
As mentioned earlier, ${patientId} is concerned about their body image and feels embarrassed by the large bump on their body. They wish to be able to participate in activities without being distracted by this issue.

**Mental Health Challenges**:
${patientId} reports feelings of frustration, irritability, anxiety, and hopelessness. They also experience rumination and low mood or depression. These emotions affect their ability to cope with daily tasks and interact with others.

**Impact on Interpersonal Relationships**:
${patientId}'s condition affects their relationships with family and friends. They mention wanting to be able to play with their grandchild and participate in family trips, indicating a desire for normalcy in their social life.

**Employment and Financial Concerns**:
Although not explicitly mentioned, there is no information provided about employment or financial concerns.

Please note that the above summary only reflects the content provided in the patient narrative excerpts.`
      }
    };

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
