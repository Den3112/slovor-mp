# 🔧 IMPLEMENTATION GUIDE

> Ready-to-use code snippets for marketplace features

---

## 📌 OVERVIEW

This guide contains production-ready code for:
- Database schemas (PostgreSQL)
- API endpoints (TypeScript/Node.js)
- React components
- Elasticsearch queries
- WebSocket implementation

**Note:** Full implementation code (120KB) includes complete examples for all 10 features.

---

## 💾 DATABASE SCHEMAS

### Reviews & Ratings

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_buyer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_listing ON reviews(listing_id);
CREATE INDEX idx_reviews_seller ON reviews(seller_id);
```

### Premium Listings

```sql
CREATE TABLE premium_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('featured', 'top', 'bump')),
  expires_at TIMESTAMPTZ NOT NULL,
  payment_id TEXT,
  amount_paid DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_premium_active ON premium_listings(listing_id, expires_at)
WHERE expires_at > NOW();
```

### Messages

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id),
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
```

---

## 🔌 API ENDPOINTS

### Reviews API

```typescript
// app/api/reviews/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { listing_id, rating, comment } = await req.json();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      listing_id,
      reviewer_id: user.id,
      rating,
      comment
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const listing_id = req.nextUrl.searchParams.get('listing_id');
  
  const { data, error } = await supabase
    .from('reviews')
    .select('*, reviewer:auth.users(name, avatar_url)')
    .eq('listing_id', listing_id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
```

### Premium Listings API

```typescript
// app/api/premium/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { listing_id, type } = await req.json();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Pricing
  const prices = {
    featured: 299,  // €2.99
    top: 499,       // €4.99
    bump: 199       // €1.99
  };

  const amount = prices[type as keyof typeof prices];
  
  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    metadata: { listing_id, type }
  });

  return NextResponse.json({ 
    clientSecret: paymentIntent.client_secret 
  });
}
```

---

## ⚛️ REACT COMPONENTS

### Review Form

```typescript
// components/review/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  listingId: string;
  onSuccess: () => void;
}

export function ReviewForm({ listingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId, rating, comment })
    });

    if (res.ok) {
      onSuccess();
      setRating(0);
      setComment('');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg p-2"
          rows={4}
          placeholder="Share your experience..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
```

### Premium Badge

```typescript
// components/listing/PremiumBadge.tsx
import { Crown, TrendingUp, Zap } from 'lucide-react';

interface PremiumBadgeProps {
  type: 'featured' | 'top' | 'bump';
}

export function PremiumBadge({ type }: PremiumBadgeProps) {
  const badges = {
    featured: {
      icon: Crown,
      label: 'Featured',
      className: 'bg-yellow-100 text-yellow-800'
    },
    top: {
      icon: TrendingUp,
      label: 'Top Placement',
      className: 'bg-purple-100 text-purple-800'
    },
    bump: {
      icon: Zap,
      label: 'Recently Bumped',
      className: 'bg-green-100 text-green-800'
    }
  };

  const { icon: Icon, label, className } = badges[type];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
```

---

## 🔍 ELASTICSEARCH

### Search Query

```typescript
// lib/search/elasticsearch.ts
import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL
});

export async function searchListings({
  query,
  category,
  priceMin,
  priceMax,
  location
}: SearchParams) {
  const must: any[] = [];

  // Full-text search
  if (query) {
    must.push({
      multi_match: {
        query,
        fields: ['title^3', 'description'],
        fuzziness: 'AUTO'
      }
    });
  }

  // Filters
  const filter: any[] = [];
  
  if (category) {
    filter.push({ term: { category_id: category } });
  }

  if (priceMin || priceMax) {
    filter.push({
      range: {
        price: {
          gte: priceMin,
          lte: priceMax
        }
      }
    });
  }

  if (location) {
    must.push({
      match: {
        location: {
          query: location,
          fuzziness: 'AUTO'
        }
      }
    });
  }

  const { body } = await client.search({
    index: 'listings',
    body: {
      query: {
        bool: {
          must,
          filter,
          should: [
            { term: { featured: { value: true, boost: 2.0 } } }
          ]
        }
      },
      sort: [
        { _score: 'desc' },
        { created_at: 'desc' }
      ]
    }
  });

  return body.hits.hits.map((hit: any) => hit._source);
}
```

---

## 💬 WEBSOCKET (MESSAGING)

### Socket.io Server

```typescript
// lib/socket/server.ts
import { Server } from 'socket.io';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: process.env.NEXT_PUBLIC_URL }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('send_message', async (data) => {
      const { conversation_id, sender_id, content } = data;

      // Save to database
      const { data: message, error } = await supabase
        .from('messages')
        .insert({ conversation_id, sender_id, content })
        .select()
        .single();

      if (!error) {
        // Broadcast to conversation
        io.to(conversation_id).emit('new_message', message);
      }
    });

    socket.on('typing', (data) => {
      socket.to(data.conversation_id).emit('user_typing', {
        user_id: data.user_id
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}
```

---

## ✅ USAGE EXAMPLES

### Using Review Form

```typescript
// app/listing/[id]/page.tsx
import { ReviewForm } from '@/components/review/ReviewForm';

export default function ListingPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* ... listing details ... */}
      
      <section>
        <h2>Leave a Review</h2>
        <ReviewForm 
          listingId={params.id}
          onSuccess={() => {
            // Refresh reviews
            window.location.reload();
          }}
        />
      </section>
    </div>
  );
}
```

### Using Search

```typescript
// app/search/page.tsx
import { searchListings } from '@/lib/search/elasticsearch';

export default async function SearchPage({ searchParams }: any) {
  const results = await searchListings({
    query: searchParams.q,
    category: searchParams.category,
    priceMin: searchParams.price_min,
    priceMax: searchParams.price_max,
    location: searchParams.location
  });

  return (
    <div>
      <h1>Search Results</h1>
      <ListingGrid listings={results} />
    </div>
  );
}
```

---

## 🔗 NEXT STEPS

1. Choose a feature from Phase 2
2. Copy relevant code sections
3. Adapt to your project structure
4. Test thoroughly
5. Deploy to production

---

*For complete implementation details (120KB), including all 10 features with full code examples, refer to the comprehensive implementation guide.*
