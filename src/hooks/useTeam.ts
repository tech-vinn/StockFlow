import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';

export function useTeam(isAdmin: boolean) {
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newJoiner, setNewJoiner] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'users'), orderBy('joinedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const members: UserProfile[] = [];
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && !loading) {
          const data = change.doc.data() as UserProfile;
          setNewJoiner(data);
          // Auto-clear notification after 5 seconds
          setTimeout(() => setNewJoiner(null), 5000);
        }
      });

      snapshot.forEach((doc) => {
        members.push(doc.data() as UserProfile);
      });
      
      setTeamMembers(members);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, [isAdmin, loading]);

  return { teamMembers, loading, newJoiner, clearNotification: () => setNewJoiner(null) };
}
