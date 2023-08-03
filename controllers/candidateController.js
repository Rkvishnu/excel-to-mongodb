import Candidate from "../models/candidateModel.js";

// Function to add candidates to the database
export async function addCandidates(candidates) {
  try {
    for (const candidate of candidates) {
      // Check if the candidate already exists based on the email
      const existingCandidate = await Candidate.findOne({ email: candidate.email });
      // If a candidate with the same email exists, skip this candidate
      if (existingCandidate) {
        console.log(`Skipping candidate with email: ${candidate.email}, as it already exists.`);
        continue;
      }
      // Create a new Candidate document and save it to the database
      const newCandidate = new Candidate(candidate);
      await newCandidate.save();
    }
    return "Candidates added successfully.";
  } catch (err) {
    console.error("Error while processing candidates:", err.message);
    throw new Error("An error occurred while processing the candidates.");
  }
}
