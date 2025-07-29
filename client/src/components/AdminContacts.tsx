import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Mail, User, MessageSquare, Calendar } from 'lucide-react';
import type { Contact } from '@shared/schema';

export default function AdminContacts() {
  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return response.json();
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading contacts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <Badge variant="secondary">
          {contacts.length} message{contacts.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{contact.name}</span>
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{contact.email}</span>
                </div>
                <Badge variant="outline">{contact.projectType}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                <p className="text-sm leading-relaxed">{contact.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No contact messages yet.</p>
        </div>
      )}
    </div>
  );
}