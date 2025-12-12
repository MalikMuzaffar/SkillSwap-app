import React from "react";
import { Github, Linkedin } from "lucide-react";
import usman from "../assest/usman.jpg";
import muzaffar from "../assest/muzaffar.jpg";

const developers = [
  {
    name: "Usman Ali",
    role: "Full-Stack Developer",
    image: usman,
    bio: "Usman is passionate about building scalable web applications and bringing ideas to life using the MERN stack.",
    github: "https://github.com/Usmanali3323/",
    linkedin: "https://www.linkedin.com/in/usman-ali-8aa5a223b/",
    portfolio: "https://portflio-4ac1d.firebaseapp.com/",
  },
  {
    name: "Muzaffar Ibrar",
    role: "Frontend Developer + DevOps Engineer",
    image: muzaffar,
    bio: "Muzaffar loves solving frontend challenges and designing user interfaces for robust web systems. And also working as DevOps Engineer.",
    github: "https://github.com/MalikMuzaffar",
    linkedin: "https://www.linkedin.com/in/muzaffar-ibrar-13a692302",
  },
];

const DeveloperComp = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">
          Meet Our Developers
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          A team of passionate and skilled developers behind the SkillSwap project.
        </p>

        {/* Developer Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {developers.map((dev, idx) => (
            <div
              key={idx}
              className="w-full sm:w-[340px] bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-28 h-28 rounded-full mb-4 border-4 border-indigo-200 object-cover shadow-md"
                />
                <h3 className="text-xl font-semibold text-indigo-800">{dev.name}</h3>
                <p className="text-sm text-indigo-500 mb-3">{dev.role}</p>
                <p className="text-sm text-gray-600">{dev.bio}</p>

                <div className="flex justify-center gap-4 mt-4">
                  {dev.github && (
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-indigo-600 transition"
                    >
                      <Github />
                    </a>
                  )}
                  {dev.linkedin && (
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-indigo-600 transition"
                    >
                      <Linkedin />
                    </a>
                  )}
                  {dev.portfolio && (
                    <a
                      href={dev.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:underline font-medium"
                    >
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeveloperComp;
