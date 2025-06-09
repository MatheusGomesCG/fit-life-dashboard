
import React from "react";
import ChatDashboard from "@/components/chat/ChatDashboard";

const ChatProfessor: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Chat com Alunos
        </h1>
        <p className="text-gray-600 mt-1">
          Converse com seus alunos em tempo real
        </p>
      </div>

      <ChatDashboard />
    </div>
  );
};

export default ChatProfessor;
