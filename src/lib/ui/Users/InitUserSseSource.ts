import { onDestroy, onMount } from 'svelte';
import type { User } from '@supabase/supabase-js';
import { UserEntity, UserSseSource } from '$lib/domain/Users';
