import React, { useState, useEffect } from 'react';
import { Users, Plus, Download, Upload, Trash2, Loader2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  personality?: string;
}

const AIEmployeeManager: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('ai_employees');
    return saved ? JSON.parse(saved) : [];
  });
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '' });
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{[key: string]: string[]}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai_employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = async () => {
    if (!newEmployee.name || !newEmployee.role) return;
    setIsLoading(true);

    try {
      const apiKey = localStorage.getItem('groq_key');
      if (!apiKey) {
        throw new Error('Groq API key not found. Please add it in Settings.');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{ 
            role: 'user', 
            content: `Create a brief personality description for an AI employee named ${newEmployee.name} who works as a ${newEmployee.role}. Include their key traits and work style.`
          }],
          temperature: 0.7,
          max_tokens: 200,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate personality');
      }

      const data = await response.json();
      const personality = data.choices[0]?.message?.content || '';

      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        role: newEmployee.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        personality
      };

      setEmployees(prev => [...prev, employee]);
      setNewEmployee({ name: '', role: '' });
      setChatHistory(prev => ({ ...prev, [employee.id]: [] }));
    } catch (error) {
      console.error('Error generating employee personality:', error);
      // Add employee even if personality generation fails
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        role: newEmployee.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };
      setEmployees(prev => [...prev, employee]);
      setNewEmployee({ name: '', role: '' });
      setChatHistory(prev => ({ ...prev, [employee.id]: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    const newChatHistory = { ...chatHistory };
    delete newChatHistory[id];
    setChatHistory(newChatHistory);
    if (selectedEmployee === id) setSelectedEmployee(null);
  };

  const sendMessage = async (employeeId: string) => {
    if (!chatMessage.trim()) return;
    setIsLoading(true);

    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const newHistory = [
      ...(chatHistory[employeeId] || []),
      `You: ${chatMessage}`
    ];

    try {
      const apiKey = localStorage.getItem('groq_key');
      if (!apiKey) {
        throw new Error('Groq API key not found. Please add it in Settings.');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { 
              role: 'system', 
              content: `You are ${employee.name}, a ${employee.role}. ${employee.personality || ''} Respond in character to the user's message.`
            },
            { role: 'user', content: chatMessage }
          ],
          temperature: 0.7,
          max_tokens: 200,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I cannot respond at the moment.';
      newHistory.push(`${employee.name}: ${aiResponse}`);
    } catch (error) {
      console.error('Error sending message:', error);
      newHistory.push(`${employee.name}: I apologize, but I'm having trouble responding right now.`);
    } finally {
      setChatHistory({ ...chatHistory, [employeeId]: newHistory });
      setChatMessage('');
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      employees,
      chatHistory
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_employees_backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setEmployees(data.employees || []);
        setChatHistory(data.chatHistory || {});
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Employees</h2>
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="p-1.5 hover:bg-gray-200 rounded-md"
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>
            <label className="p-1.5 hover:bg-gray-200 rounded-md cursor-pointer" title="Import">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Add Employee Form */}
        <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
            className="w-full mb-2 px-3 py-1.5 border rounded"
          />
          <input
            type="text"
            placeholder="Role"
            value={newEmployee.role}
            onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
            className="w-full mb-2 px-3 py-1.5 border rounded"
          />
          <button
            onClick={addEmployee}
            disabled={isLoading || !newEmployee.name || !newEmployee.role}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Employee
              </>
            )}
          </button>
        </div>

        {/* Employee List */}
        <div className="space-y-2">
          {employees.map(employee => (
            <div
              key={employee.id}
              onClick={() => setSelectedEmployee(employee.id)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                selectedEmployee === employee.id ? 'bg-blue-50' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-xs text-gray-500">{employee.role}</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeEmployee(employee.id);
                }}
                className="p-1 hover:bg-red-100 rounded-md group"
              >
                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedEmployee ? (
          <>
            <div className="flex-1 p-4 overflow-auto">
              {chatHistory[selectedEmployee]?.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg ${
                    message.startsWith('You:')
                      ? 'bg-blue-100 ml-auto'
                      : 'bg-gray-100'
                  } max-w-[80%]`}
                >
                  {message}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500 p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && !isLoading && sendMessage(selectedEmployee)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(selectedEmployee)}
                  disabled={isLoading || !chatMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p>Select an employee to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEmployeeManager;